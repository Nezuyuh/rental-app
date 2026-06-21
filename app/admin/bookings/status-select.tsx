'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface StatusSelectProps {
  bookingId: string
  currentStatus: string
}

export function StatusSelect({ bookingId, currentStatus }: StatusSelectProps) {
  const router = useRouter()
  const [value, setValue] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const update = async (status: string) => {
    setLoading(true)
    const prev = value
    setValue(status)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      setValue(prev)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => update(e.target.value)}
      className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  )
}
