import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lumière — Maintenance',
  description: 'La plateforme est temporairement en maintenance.',
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/3 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Logo / Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl mb-6">
            <span className="text-4xl">🎬</span>
          </div>
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Lumière
          </h1>
        </div>

        {/* Glassmorphism card */}
        <div className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl rounded-2xl p-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs text-[#D4AF37] font-medium">Maintenance en cours</span>
          </div>

          <h2 className="text-xl font-semibold text-white">
            Nous améliorons votre expérience
          </h2>

          <p className="text-white/50 text-sm leading-relaxed">
            La plateforme Lumière est actuellement en maintenance pour une mise à jour importante.
            Nous serons de retour très bientôt avec de nouvelles fonctionnalités.
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#D4AF37]"
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Contact */}
        <p className="mt-6 text-xs text-white/30">
          Contact : <a href="mailto:contact@lumiere.film" className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors">contact@lumiere.film</a>
        </p>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
