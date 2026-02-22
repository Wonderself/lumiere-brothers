import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A] py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clapperboard className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-lg font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>
                LUMIÈRE
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              La plateforme de micro-tâches créatives pour la production collaborative de films IA.
            </p>
            <p className="text-xs text-white/20">
              © 2026 Lumière Brothers Pictures. Tous droits réservés.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Plateforme</h4>
            <ul className="space-y-2">
              <li><Link href="/films" className="text-sm text-white/40 hover:text-white transition-colors">Catalogue Films</Link></li>
              <li><Link href="/tasks" className="text-sm text-white/40 hover:text-white transition-colors">Tâches Disponibles</Link></li>
              <li><Link href="/leaderboard" className="text-sm text-white/40 hover:text-white transition-colors">Classement</Link></li>
              <li><Link href="/roadmap" className="text-sm text-white/40 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* For Contributors */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Contribuer</h4>
            <ul className="space-y-2">
              <li><Link href="/register" className="text-sm text-white/40 hover:text-white transition-colors">Créer un compte</Link></li>
              <li><Link href="/register?role=SCREENWRITER" className="text-sm text-white/40 hover:text-white transition-colors">Soumettre un scénario</Link></li>
              <li><Link href="/about" className="text-sm text-white/40 hover:text-white transition-colors">Comment ça marche</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/legal/terms" className="text-sm text-white/40 hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="/legal/cookies" className="text-sm text-white/40 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            Construit avec passion à Paris & Tel Aviv
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/20">Stack : Next.js · PostgreSQL · Claude IA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
