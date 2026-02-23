import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

const currentYear = new Date().getFullYear()

const footerLinks = {
  platform: [
    { href: '/films', label: 'Catalogue Films' },
    { href: '/actors', label: 'Acteurs IA' },
    { href: '/streaming', label: 'Streaming' },
    { href: '/leaderboard', label: 'Classement' },
    { href: '/roadmap', label: 'Roadmap' },
  ],
  creators: [
    { href: '/register', label: 'Creer un compte' },
    { href: '/register?role=SCREENWRITER', label: 'Soumettre un scenario' },
    { href: '/community', label: 'Communaute' },
    { href: '/community/contests', label: 'Concours' },
    { href: '/about', label: 'Comment ca marche' },
  ],
  legal: [
    { href: '/legal/terms', label: 'CGU' },
    { href: '/legal/privacy', label: 'Confidentialite' },
    { href: '/legal/cookies', label: 'Cookies' },
  ],
  contact: [
    { href: 'mailto:contact@lumiere.film', label: 'contact@lumiere.film' },
    { href: '/about', label: 'A propos' },
  ],
}

const socialLinks = [
  { href: 'https://x.com/lumiere_film', label: 'X', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { href: 'https://instagram.com/lumiere.film', label: 'Instagram', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { href: 'https://youtube.com/@lumiere-film', label: 'YouTube', svg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
]

export function Footer() {
  return (
    <footer className="bg-[#1A1A2E] border-t-2 border-[#D4AF37] mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Clapperboard className="h-6 w-6 text-[#D4AF37] group-hover:text-[#F0D060] transition-colors duration-200" />
              <span className="text-lg font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>
                LUMIERE
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              La plateforme de production collaborative pour le cinema IA. Creez, collaborez, investissez.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-all duration-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.svg} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Plateforme</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Createurs</h4>
            <ul className="space-y-2.5">
              {footerLinks.creators.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5">
              {footerLinks.contact.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {currentYear} Lumiere Brothers Pictures. Tous droits reserves.
          </p>
          <p className="text-xs text-white/20">
            Propulse par Next.js &middot; PostgreSQL &middot; Claude IA
          </p>
        </div>
      </div>
    </footer>
  )
}
