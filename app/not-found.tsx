import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🏍️</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Lost the Trail</h1>
        <p className="text-gray-500 mb-8 text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/motorcycles"
            className="border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Fleet
          </Link>
        </div>
      </div>
    </div>
  )
}
