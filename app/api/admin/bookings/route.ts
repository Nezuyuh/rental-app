import { NextResponse } from 'next/server'
import { createClient, adminClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 as const }
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden', status: 403 as const }
  return { ok: true as const }
}

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { data, error } = await adminClient
    .from('bookings')
    .select('*, motorcycle:motorcycles(*), profile:profiles(full_name, phone, role)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings: data })
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await req.json()
  const { user_id, motorcycle_id, start_date, end_date, payment_method, status, payment_status, notes } = body

  if (!user_id || !motorcycle_id || !start_date || !end_date) {
    return NextResponse.json({ error: 'Customer, motorcycle, and dates are required.' }, { status: 400 })
  }

  const start = new Date(start_date)
  const end = new Date(end_date)
  const total_days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (total_days < 1) return NextResponse.json({ error: 'End date must be after start date.' }, { status: 400 })

  const { data: moto, error: motoErr } = await adminClient
    .from('motorcycles')
    .select('price_per_day')
    .eq('id', motorcycle_id)
    .single()
  if (motoErr || !moto) return NextResponse.json({ error: 'Motorcycle not found.' }, { status: 404 })

  const total_price = moto.price_per_day * total_days

  const { data, error } = await adminClient
    .from('bookings')
    .insert({
      user_id,
      motorcycle_id,
      start_date,
      end_date,
      total_days,
      total_price,
      payment_method: payment_method || 'cash',
      status: status || 'pending',
      payment_status: payment_status || 'pending',
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ booking: data }, { status: 201 })
}
