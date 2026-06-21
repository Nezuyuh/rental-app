import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') redirect('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://bvzigsuidankvlxhqidn.supabase.co/storage/v1/object/public/motorent-assets/logo.jpg"
            alt="MotoRent"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-bold text-gray-900">MotoRent</span>
        </a>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            Hello, {profile?.full_name || user.email}
          </span>

          <Link
            href="/motorcycles"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
          >
            Browse Fleet
          </Link>

          {profile?.role === 'admin' && (
            <a
              href="/admin"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              Admin Panel
            </a>
          )}

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
