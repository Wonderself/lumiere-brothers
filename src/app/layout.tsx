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
  metadataBase: new URL('https://lumiere.film'),
  title: {
    template: '%s | Lumière',
    default: 'Lumière — Créez le Cinéma de Demain',
  },
  description:
    "Lumière est la plateforme de micro-tâches créatives pour la production collaborative de films d'intelligence artificielle. Contribuez, créez, et soyez payé.",
  keywords: [
    'cinéma IA',
    'film intelligence artificielle',
    'production collaborative',
    'micro-tâches créatives',
    'co-production film',
    'streaming IA',
    'acteurs IA',
    'Lumière',
    'cinéma du futur',
    'freelance créatif',
  ],
  authors: [{ name: 'Lumière Brothers Pictures' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Lumière',
    title: 'Lumière — Créez le Cinéma de Demain',
    description: "La plateforme de micro-tâches pour la création collaborative de films IA",
    url: 'https://lumiere.film',
  },
  twitter: {
    card: 'summary_large_image',
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
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-white text-[#1A1A2E]`}>
        <AuthSessionProvider>
        {children}
        <CookieBanner />
        <Toaster
          theme="light"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E8E8ED',
              color: '#1A1A2E',
            },
          }}
        />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
