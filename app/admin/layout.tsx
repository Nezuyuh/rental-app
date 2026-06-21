import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://bvzigsuidankvlxhqidn.supabase.co/storage/v1/object/public/motorent-assets/logo.jpg"
              alt="MotoRent"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-bold hidden sm:block">MotoRent Admin</span>
          </a>
          <a href="/admin" className="text-sm text-gray-300 hover:text-white transition-colors">
            Dashboard
          </a>
          <a
            href="/admin/motorcycles"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Fleet
          </a>
          <a
            href="/admin/bookings"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Bookings
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            User Dashboard
          </a>
          <form action="/api/auth/signout" method="POST">
            <button className="text-sm text-gray-300 hover:text-white transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
