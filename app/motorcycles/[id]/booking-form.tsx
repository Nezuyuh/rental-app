'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  motorcycleId: string
  pricePerDay: number
}

export function BookingForm({ motorcycleId, pricePerDay }: BookingFormProps) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash' | 'card'>('cash')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const totalDays =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const totalPrice = totalDays * pricePerDay

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.')
      return
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after the start date.')
      return
    }

    if (totalDays < 1) {
      setError('Minimum rental is 1 day.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motorcycle_id: motorcycleId,
          start_date: startDate,
          end_date: endDate,
          total_days: totalDays,
          total_price: totalPrice,
          payment_method: paymentMethod,
          notes: notes.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to create booking. Please try again.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start date
          </label>
          <input
            type="date"
            required
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End date
          </label>
          <input
            type="date"
            required
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'gcash' | 'card')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
        >
          <option value="cash">Cash</option>
          <option value="gcash">GCash</option>
          <option value="card">Credit / Debit Card</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or information..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
        />
      </div>

      {/* Price summary */}
      {totalDays > 0 && (
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>₱{pricePerDay.toLocaleString()} × {totalDays} day{totalDays !== 1 ? 's' : ''}</span>
            <span>₱{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-orange-200">
            <span>Total</span>
            <span className="text-orange-500">₱{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 rounded-lg transition-colors"
      >
        {loading ? 'Confirming…' : 'Confirm Booking'}
      </button>

      <p className="text-xs text-center text-gray-400">
        You can cancel pending bookings from your dashboard.
      </p>
    </form>
  )
}
