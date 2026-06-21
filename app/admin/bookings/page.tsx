import { adminClient } from '@/lib/supabase-server'
import type { Booking } from '@/lib/types'
import { StatusSelect } from './status-select'

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

export default async function AdminBookingsPage() {
  const { data: bookings } = await adminClient
    .from('bookings')
    .select('*, motorcycle:motorcycles(name, type), profile:profiles(full_name, phone)')
    .order('created_at', { ascending: false })

  const typedBookings = (bookings || []) as Booking[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">All Bookings</h1>
        <span className="text-sm text-gray-500">{typedBookings.length} total</span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {typedBookings.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Motorcycle
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Dates
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Days
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Payment
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {typedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {booking.profile?.full_name || 'Unknown'}
                      </div>
                      {booking.profile?.phone && (
                        <div className="text-xs text-gray-400">{booking.profile.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-700">
                        {booking.motorcycle?.name || 'Unknown'}
                      </div>
                      {booking.motorcycle?.type && (
                        <div className="text-xs text-gray-400">{booking.motorcycle.type}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      <div>
                        {new Date(booking.start_date).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs">
                        →{' '}
                        {new Date(booking.end_date).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {booking.total_days}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900">
                      ₱{booking.total_price.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-gray-600">
                          {PAYMENT_LABELS[booking.payment_method] || booking.payment_method}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            booking.payment_status === 'paid'
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {booking.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusSelect
                        bookingId={booking.id}
                        currentStatus={booking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
