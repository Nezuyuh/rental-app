import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('bookings')
    .select('*, motorcycle:motorcycles(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { motorcycle_id, start_date, end_date, payment_method, notes } = body

  const start = new Date(start_date)
  const end = new Date(end_date)
  const total_days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (total_days < 1) return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })

  const { data: moto, error: motoErr } = await supabase
    .from('motorcycles')
    .select('price_per_day, is_available')
    .eq('id', motorcycle_id)
    .single()

  if (motoErr || !moto) return NextResponse.json({ error: 'Motorcycle not found' }, { status: 404 })
  if (!moto.is_available) return NextResponse.json({ error: 'Motorcycle not available' }, { status: 400 })

  const total_price = moto.price_per_day * total_days

  const { data, error } = await supabase
    .from('bookings')
    .insert({ user_id: user.id, motorcycle_id, start_date, end_date, total_days, total_price, payment_method: payment_method || 'cash', notes })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ booking: data }, { status: 201 })
}
