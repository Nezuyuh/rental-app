export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <img
              src="https://bvzigsuidankvlxhqidn.supabase.co/storage/v1/object/public/motorent-assets/logo.jpg"
              alt="MotoRent"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-2xl font-bold text-white">MotoRent</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
