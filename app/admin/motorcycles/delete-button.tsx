'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteButton({
  motorcycleId,
  motorcycleName,
}: {
  motorcycleId: string
  motorcycleName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${motorcycleName}"? This cannot be undone.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/motorcycles/${motorcycleId}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
      title="Delete"
    >
      <Trash2 size={15} />
    </button>
  )
}
