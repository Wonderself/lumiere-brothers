import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Auth Header */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Clapperboard className="h-6 w-6 text-[#D4AF37]" />
          <span className="text-lg font-bold text-[#1A1A2E]" style={{ fontFamily: 'var(--font-playfair)' }}>
            LUMIERE
          </span>
        </Link>
      </div>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Decorative background — soft gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#8B5CF6]/[0.04] blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-[#3B82F6]/[0.03] blur-[100px]" />
      </div>
    </div>
  )
}
