'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CancelButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to cancel booking')
      router.refresh()
    } catch {
      setError('Could not cancel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={cancel}
        disabled={loading}
        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 font-medium transition-colors"
      >
        {loading ? 'Cancelling…' : 'Cancel booking'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
