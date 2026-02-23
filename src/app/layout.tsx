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
  metadataBase: new URL('https://creators.lumiere.film'),
  title: {
    template: '%s | Lumière Creators',
    default: 'Lumière Creators — Le Studio IA pour Créateurs de Contenu',
  },
  description:
    "Lumière Creators : outils IA pour créateurs, marketplace de micro-tâches guidées, collaboration, analytics. Créez, collaborez, gagnez.",
  keywords: [
    'créateurs de contenu',
    'outils IA créateurs',
    'micro-tâches IA',
    'marketplace freelance IA',
    'vidéo IA',
    'collaboration créative',
    'analytics créateurs',
    'Lumière Creators',
    'services IA guidés',
    'design IA',
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
    siteName: 'Lumière Creators',
    title: 'Lumière Creators — Le Studio IA pour Créateurs de Contenu',
    description: "Outils IA, micro-tâches guidées et collaboration pour créateurs de contenu.",
    url: 'https://creators.lumiere.film',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumière Creators — Le Studio IA pour Créateurs',
    description: "Outils IA, micro-tâches guidées et collaboration pour créateurs de contenu.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#FAFAF8] text-[#1A1A2E]`}>
        <AuthSessionProvider>
        {children}
        <CookieBanner />
        <Toaster
          theme="light"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E5E5E0',
              color: '#1A1A2E',
            },
          }}
        />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
