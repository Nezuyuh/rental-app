'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, X } from 'lucide-react'
import type { Motorcycle } from '@/lib/types'

const TYPES = ['Scooter', 'Maxi Scooter', 'Adventure', 'Naked Sport', 'Underbone', 'Trail']

export function EditMotorcycleForm({ motorcycle }: { motorcycle: Motorcycle }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: motorcycle.name,
    type: motorcycle.type,
    description: motorcycle.description || '',
    price_per_day: String(motorcycle.price_per_day),
    location: motorcycle.location,
    is_available: motorcycle.is_available,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target
    const value =
      target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setForm((prev) => ({ ...prev, [target.name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/motorcycles/${motorcycle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price_per_day: Number(form.price_per_day),
          description: form.description.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to update.')
        return
      }
      setOpen(false)
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-500 hover:text-blue-700 transition-colors"
        title="Edit"
      >
        <Pencil size={15} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">Edit — {motorcycle.name}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day (₱) *</label>
                  <input
                    name="price_per_day"
                    type="number"
                    value={form.price_per_day}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`avail-${motorcycle.id}`}
                    name="is_available"
                    checked={form.is_available}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <label htmlFor={`avail-${motorcycle.id}`} className="text-sm font-medium text-gray-700">
                    Available for rental
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
