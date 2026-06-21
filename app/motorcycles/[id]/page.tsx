import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Star, ArrowLeft, Bike } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import type { Motorcycle } from '@/lib/types'
import { BookingForm } from './booking-form'

export default async function MotorcycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: motorcycle, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !motorcycle) {
    notFound()
  }

  const moto = motorcycle as Motorcycle

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/motorcycles"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Fleet
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Motorcycle Details */}
        <div>
          {/* Image */}
          <div className="bg-gradient-to-br from-orange-50 to-gray-100 rounded-2xl h-64 sm:h-80 flex items-center justify-center text-8xl select-none overflow-hidden mb-6">
            {moto.image_url ? (
              <img
                src={moto.image_url}
                alt={moto.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              '🏍️'
            )}
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-extrabold text-gray-900">{moto.name}</h1>
              <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full shrink-0 ml-3">
                {moto.type}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-orange-400" />
                {moto.location}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-700">{moto.rating}</span>
                <span>({moto.review_count} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <Bike size={14} className="text-orange-400" />
                {moto.is_available ? (
                  <span className="text-green-600 font-medium">Available</span>
                ) : (
                  <span className="text-red-500 font-medium">Not Available</span>
                )}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-extrabold text-gray-900">
                ₱{moto.price_per_day.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm"> / day</span>
            </div>

            {moto.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{moto.description}</p>
            )}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Book This Motorcycle</h2>
            {moto.is_available ? (
              <BookingForm
                motorcycleId={moto.id}
                pricePerDay={moto.price_per_day}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  This motorcycle is currently unavailable.
                </p>
                <Link
                  href="/motorcycles"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  Browse other bikes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
