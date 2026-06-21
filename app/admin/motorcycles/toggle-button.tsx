'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ToggleButtonProps {
  motorcycleId: string
  isAvailable: boolean
}

export function ToggleButton({ motorcycleId, isAvailable }: ToggleButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(isAvailable)

  const toggle = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/motorcycles/${motorcycleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !current }),
      })
      setCurrent(!current)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
        current ? 'bg-green-500' : 'bg-gray-300'
      }`}
      title={current ? 'Mark as unavailable' : 'Mark as available'}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
          current ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
