import { adminClient } from '@/lib/supabase-server'
import type { Motorcycle } from '@/lib/types'
import { ToggleButton } from './toggle-button'
import { AddMotorcycleForm } from './add-motorcycle-form'
import { EditMotorcycleForm } from './edit-motorcycle-form'
import { DeleteButton } from './delete-button'

export default async function AdminMotorcyclesPage() {
  const { data: motorcycles } = await adminClient
    .from('motorcycles')
    .select('*')
    .order('created_at', { ascending: false })

  const typedMotorcycles = (motorcycles || []) as Motorcycle[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Fleet Management</h1>
        <span className="text-sm text-gray-500">{typedMotorcycles.length} motorcycles</span>
      </div>

      <AddMotorcycleForm />

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {typedMotorcycles.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No motorcycles in the fleet yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price/Day</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Available</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {typedMotorcycles.map((moto) => (
                  <tr key={moto.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{moto.name}</div>
                      {moto.description && (
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{moto.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                        {moto.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{moto.location}</td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900">
                      ₱{moto.price_per_day.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <ToggleButton motorcycleId={moto.id} isAvailable={moto.is_available} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-600">
                      ⭐ {moto.rating}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <EditMotorcycleForm motorcycle={moto} />
                        <DeleteButton motorcycleId={moto.id} motorcycleName={moto.name} />
                      </div>
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
