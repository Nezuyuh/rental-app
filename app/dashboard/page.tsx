import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import type { Booking } from '@/lib/types'
import { CancelButton } from './cancel-button'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash',
  gcash: 'GCash',
  card: 'Card',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, motorcycle:motorcycles(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedBookings = (bookings || []) as Booking[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">My Bookings</h1>
        <Link
          href="/motorcycles"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Book a Motorcycle
        </Link>
      </div>

      {typedBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🏍️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-6">
            Ready to explore Cebu? Browse our fleet and book your first motorcycle.
          </p>
          <Link
            href="/motorcycles"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Motorcycles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {typedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Motorcycle info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-gray-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                    🏍️
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {booking.motorcycle?.name || 'Unknown Motorcycle'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {booking.motorcycle?.type} · {booking.motorcycle?.location}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>
                        {new Date(booking.start_date).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        →{' '}
                        {new Date(booking.end_date).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span>{booking.total_days} day{booking.total_days !== 1 ? 's' : ''}</span>
                      <span className="text-gray-300">·</span>
                      <span>{PAYMENT_LABELS[booking.payment_method] || booking.payment_method}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price, status, actions */}
                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                  <p className="text-xl font-extrabold text-gray-900">
                    ₱{booking.total_price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.payment_status === 'paid' ? (
                      <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">
                        Paid
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-50 text-gray-400 font-medium px-2 py-0.5 rounded-full">
                        Unpaid
                      </span>
                    )}
                  </div>
                  {booking.status === 'pending' && (
                    <CancelButton bookingId={booking.id} />
                  )}
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400">
                    <span className="font-medium text-gray-500">Notes:</span> {booking.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
