import Link from 'next/link'
import { adminClient } from '@/lib/supabase-server'
import type { Booking } from '@/lib/types'

export default async function AdminDashboardPage() {
  // Fetch stats in parallel
  const [
    { count: totalMotorcycles },
    { count: totalBookings },
    { count: pendingBookings },
    { data: completedBookings },
    { data: recentBookings },
  ] = await Promise.all([
    adminClient.from('motorcycles').select('*', { count: 'exact', head: true }),
    adminClient.from('bookings').select('*', { count: 'exact', head: true }),
    adminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    adminClient
      .from('bookings')
      .select('total_price')
      .eq('status', 'completed'),
    adminClient
      .from('bookings')
      .select('*, motorcycle:motorcycles(name), profile:profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const revenue = (completedBookings || []).reduce(
    (sum: number, b: { total_price: number }) => sum + (b.total_price || 0),
    0
  )

  const typedRecent = (recentBookings || []) as Booking[]

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
  }

  const stats = [
    { label: 'Total Motorcycles', value: totalMotorcycles ?? 0, color: 'text-orange-500' },
    { label: 'Total Bookings', value: totalBookings ?? 0, color: 'text-blue-500' },
    { label: 'Pending Bookings', value: pendingBookings ?? 0, color: 'text-amber-500' },
    {
      label: 'Revenue (Completed)',
      value: `₱${revenue.toLocaleString()}`,
      color: 'text-green-500',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <p className={`text-3xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/admin/motorcycles"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Manage Fleet
        </Link>
        <Link
          href="/admin/bookings"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Manage Bookings
        </Link>
      </div>

      {/* Recent bookings table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
        </div>
        {typedRecent.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Motorcycle
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Dates
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {typedRecent.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-700">
                      {booking.profile?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {booking.motorcycle?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(booking.start_date).toLocaleDateString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      →{' '}
                      {new Date(booking.end_date).toLocaleDateString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      ₱{booking.total_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {booking.status}
                      </span>
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
