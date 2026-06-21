import { adminClient } from '@/lib/supabase-server'
import type { Booking } from '@/lib/types'
import { StatusSelect } from './bookings/status-select'
import { AddBookingForm } from './add-booking-form'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default async function AdminDashboardPage() {
  const [
    { count: totalMotorcycles },
    { count: totalBookings },
    { count: pendingCount },
    { data: completedBookings },
    { data: bookings },
    { data: customers },
    { data: fleet },
  ] = await Promise.all([
    adminClient.from('motorcycles').select('*', { count: 'exact', head: true }),
    adminClient.from('bookings').select('*', { count: 'exact', head: true }),
    adminClient.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    adminClient.from('bookings').select('total_price').eq('status', 'completed'),
    adminClient
      .from('bookings')
      .select('*, motorcycle:motorcycles(name, type), profile:profiles(full_name, phone)')
      .order('created_at', { ascending: false }),
    adminClient.from('profiles').select('id, full_name').order('full_name'),
    adminClient.from('motorcycles').select('id, name, price_per_day').order('name'),
  ])

  const revenue = (completedBookings || []).reduce(
    (sum: number, b: { total_price: number }) => sum + (b.total_price || 0),
    0
  )

  const typedBookings = (bookings || []) as Booking[]

  const stats = [
    { label: 'Motorcycles', value: totalMotorcycles ?? 0, color: 'text-orange-500' },
    { label: 'Total Bookings', value: totalBookings ?? 0, color: 'text-blue-500' },
    { label: 'Pending', value: pendingCount ?? 0, color: 'text-amber-500' },
    { label: 'Revenue', value: `₱${revenue.toLocaleString()}`, color: 'text-green-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className={`text-3xl font-extrabold mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-gray-900">All Bookings</h2>
            <span className="text-sm text-gray-400">{typedBookings.length} total</span>
          </div>
          <AddBookingForm
            customers={customers || []}
            motorcycles={fleet || []}
          />
        </div>

        {typedBookings.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Motorcycle</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dates</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Days</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {typedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{booking.profile?.full_name || 'Unknown'}</div>
                      {booking.profile?.phone && (
                        <div className="text-xs text-gray-400">{booking.profile.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700">{booking.motorcycle?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{booking.motorcycle?.type}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      <div>
                        {new Date(booking.start_date).toLocaleDateString('en-PH', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </div>
                      <div>
                        → {new Date(booking.end_date).toLocaleDateString('en-PH', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{booking.total_days}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                      ₱{booking.total_price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect bookingId={booking.id} currentStatus={booking.status} />
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
