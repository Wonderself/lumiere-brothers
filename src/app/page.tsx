import Link from 'next/link'
import type { Metadata } from 'next'
import { Clapperboard, Film, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lumiere — Choisissez votre experience',
  description: 'Plateforme de co-production cinematographique par IA',
}

export default function SelectorPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Logo / Title */}
      <div className="text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clapperboard className="h-10 w-10 text-[#D4AF37]" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-playfair)]">
          LUMI<span className="text-[#D4AF37]">E</span>RE
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          Choisissez votre experience
        </p>
      </div>

      {/* Two Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl w-full relative z-10">
        {/* Option 1 — Lumiere Brothers (V2 — Recommended, more prominent) */}
        <Link
          href="/home"
          className="group relative block rounded-2xl border-2 border-[#D4AF37]/30 bg-white p-8 md:p-10 transition-all duration-500 hover:border-[#D4AF37]/60 hover:shadow-xl shadow-lg md:scale-[1.02]"
        >
          {/* Subtle gold gradient background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-50/80 to-transparent pointer-events-none" />

          {/* Recommended tag */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D4AF37] text-white text-xs font-semibold shadow-md">
              <Sparkles className="h-3 w-3" />
              RECOMMANDE
            </span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                NOUVEAU
              </span>
              <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <Film className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                  Lumiere Brothers
                </h2>
                <p className="text-sm text-[#D4AF37] font-medium mt-0.5">
                  V2 — Aujourd&apos;hui
                </p>
              </div>
            </div>
            <p className="text-gray-500 leading-relaxed">
              La plateforme complete de co-production cinematographique par IA.
              Streaming, acteurs IA, communaute, tokenisation.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#D4AF37] group-hover:text-[#C5A028] transition-colors text-sm font-semibold">
              Explorer <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Option 2 — Lumiere App (V1 — Previous version, muted) */}
        <Link
          href="/films"
          className="group relative block rounded-2xl border border-gray-200 bg-white p-8 md:p-10 transition-all duration-500 hover:border-gray-300 hover:shadow-md shadow-sm"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-400 text-xs font-medium uppercase tracking-wider">
                ARCHIVE
              </span>
              <ArrowRight className="h-5 w-5 text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                <Clapperboard className="h-7 w-7 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                  Lumiere App
                </h2>
                <p className="text-sm text-gray-400 font-medium mt-0.5">
                  V1 — Version precedente
                </p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              L&apos;application de micro-taches creatives.
              Films, taches, leaderboard, profil contributeur.
            </p>
            <div className="mt-6 flex items-center gap-2 text-gray-300 group-hover:text-gray-500 transition-colors text-sm font-medium">
              Explorer <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle footer */}
      <p className="mt-16 text-gray-300 text-xs relative z-10">
        Lumiere Brothers Pictures &copy; {new Date().getFullYear()}
      </p>
    </div>
  )
}
