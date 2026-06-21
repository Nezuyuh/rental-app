'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CancelButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const cancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setLoading(true)
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
        headers: { 'Content-Type': 'application/json' },
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={cancel}
      disabled={loading}
      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 font-medium transition-colors"
    >
      {loading ? 'Cancelling…' : 'Cancel booking'}
    </button>
  )
}
