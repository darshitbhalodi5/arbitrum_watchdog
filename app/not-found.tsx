import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1db954]/10 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#1db954]/10 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 p-4">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#1db954] to-[#4ade80] bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-[#1db954] to-[#4ade80] text-black font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-8 text-sm text-gray-500">Truence - Decentralized Content Review Platform</div>
    </div>
  )
}

