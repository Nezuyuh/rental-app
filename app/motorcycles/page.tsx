import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import type { Motorcycle } from '@/lib/types'

const LOGO_URL =
  'https://bvzigsuidankvlxhqidn.supabase.co/storage/v1/object/public/motorent-assets/logo.jpg'

const TYPES = ['All', 'Scooter', 'Maxi Scooter', 'Adventure', 'Naked Sport', 'Underbone', 'Trail']

export default async function MotorcyclesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('motorcycles').select('*').eq('is_available', true)
  if (type && type !== 'all' && type !== 'All') {
    query = query.eq('type', type)
  }
  const { data: motorcycles } = await query.order('rating', { ascending: false })

  const activeType = type && type !== 'all' ? type : 'All'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="MotoRent"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span className="text-lg font-bold text-gray-900">MotoRent</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Our Motorcycle Fleet</h1>
          <p className="text-gray-500">Browse available motorcycles across Cebu.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TYPES.map((t) => {
            const href = t === 'All' ? '/motorcycles' : `/motorcycles?type=${encodeURIComponent(t)}`
            const isActive = activeType === t
            return (
              <Link
                key={t}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {t}
              </Link>
            )
          })}
        </div>

        {/* Grid */}
        {!motorcycles || motorcycles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏍️</div>
            <p className="text-gray-500 text-lg">No motorcycles found for this category.</p>
            <Link
              href="/motorcycles"
              className="mt-4 inline-block text-orange-500 hover:underline font-medium"
            >
              View all motorcycles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(motorcycles as Motorcycle[]).map((moto) => (
              <div
                key={moto.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Image or placeholder */}
                <div className="bg-gradient-to-br from-orange-50 to-gray-100 h-48 flex items-center justify-center text-7xl select-none overflow-hidden">
                  {moto.image_url ? (
                    <img
                      src={moto.image_url}
                      alt={moto.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '🏍️'
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-base">{moto.name}</h3>
                    <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {moto.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                    <MapPin size={13} />
                    <span>{moto.location}</span>
                    <span className="mx-1">·</span>
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-600 font-medium">{moto.rating}</span>
                    <span>({moto.review_count})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-gray-900">
                        ₱{moto.price_per_day.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400"> / day</span>
                    </div>
                    <Link
                      href={`/motorcycles/${moto.id}`}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Rent Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
