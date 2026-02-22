import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Auth Header */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Clapperboard className="h-6 w-6 text-[#D4AF37]" />
          <span className="text-lg font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>
            LUMIÈRE
          </span>
        </Link>
      </div>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-[120px]" />
      </div>
    </div>
  )
}
