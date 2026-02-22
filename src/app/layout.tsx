import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthSessionProvider } from '@/components/layout/session-provider'
import { CookieBanner } from '@/components/layout/cookie-banner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Lumière',
    default: 'Lumière — Créez le Cinéma de Demain',
  },
  description:
    "Lumière est la plateforme de micro-tâches créatives pour la production collaborative de films d'intelligence artificielle. Contribuez, créez, et soyez payé.",
  keywords: ['cinéma', 'IA', 'film', 'micro-tâches', 'créativité', 'production', 'freelance'],
  authors: [{ name: 'Lumière Brothers Pictures' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Lumière',
    title: 'Lumière — Créez le Cinéma de Demain',
    description: "La plateforme de micro-tâches pour la création collaborative de films IA",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#0A0A0A] text-white`}>
        <AuthSessionProvider>
        {children}
        <CookieBanner />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #222222',
              color: '#FAFAFA',
            },
          }}
        />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
