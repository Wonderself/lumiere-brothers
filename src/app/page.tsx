export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { prisma } from '@/lib/prisma'
import { FILM_STATUS_LABELS } from '@/lib/constants'
import {
  ArrowRight,
  Film,
  CheckCircle,
  ChevronRight,
  Clapperboard,
  Zap,
  Users,
  Sparkles,
  Play,
  BarChart3,
  Handshake,
  Gift,
  Crown,
  Star,
  Eye,
  UserPlus,
  Coins,
  Scan,
  Heart,
  Quote,
  Rocket,
  Shield,
  Check,
  X,
  Clock,
  TrendingUp,
  Mail,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// DATA FETCHING
// ---------------------------------------------------------------------------

async function getStats() {
  try {
    const [usersCount, filmsCount, tasksValidated, lumensTx] = await Promise.all([
      prisma.user.count(),
      prisma.film.count({ where: { isPublic: true } }),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.lumenTransaction.count(),
    ])
    return { usersCount, filmsCount, tasksValidated, lumensTx }
  } catch {
    return { usersCount: 500, filmsCount: 12, tasksValidated: 2400, lumensTx: 18000 }
  }
}

async function getFilmsInProduction() {
  try {
    return await prisma.film.findMany({
      where: { isPublic: true },
      orderBy: { progressPct: 'desc' },
      take: 6,
      include: { _count: { select: { tasks: true } } },
    })
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const howItWorksSteps = [
  {
    number: '01',
    icon: Film,
    title: 'Choisissez un Film',
    description:
      'Parcourez notre catalogue de productions IA. Chaque film a besoin de dizaines de contributeurs pour prendre vie.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Accomplissez des Micro-Taches',
    description:
      'Prompts, images, VFX, sound design, cascades... Choisissez les taches qui correspondent a vos talents.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: "L'IA Assemble Votre Contribution",
    description:
      'Notre IA evalue, integre et assemble chaque contribution dans le film. Feedback instantane, qualite cinema.',
  },
  {
    number: '04',
    icon: Crown,
    title: 'Soyez Credite au Generique',
    description:
      'Chaque contributeur est credite au generique du film. Vous etes co-createur. Votre nom, sur grand ecran.',
  },
]

const modules = [
  {
    icon: Clapperboard,
    title: 'Studio Films',
    description: 'Contribuez aux productions cinematographiques IA. Micro-taches, validation IA, credits au generique.',
    color: '#D4AF37',
    colorName: 'gold',
    href: '/films',
    badge: 'Production',
  },
  {
    icon: Sparkles,
    title: 'Createur IA',
    description: 'Generez du contenu viral sans montrer votre visage. Avatar, voix clonee, publication automatique.',
    color: '#A855F7',
    colorName: 'purple',
    href: '/creator',
    badge: 'Creation',
  },
  {
    icon: Play,
    title: 'Streaming',
    description: "Le Netflix de l'IA. Regardez, notez et decouvrez les films generes par la communaute.",
    color: '#EF4444',
    colorName: 'red',
    href: '/streaming',
    badge: 'Diffusion',
  },
  {
    icon: Handshake,
    title: 'Collabs',
    description: 'Marketplace de creatifs. Trouvez des collaborateurs, echangez des shoutouts, co-creez.',
    color: '#22C55E',
    colorName: 'green',
    href: '/collabs',
    badge: 'Reseau',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Pilotez votre croissance. Vues, revenus, engagement, reputation — tout en temps reel.',
    color: '#3B82F6',
    colorName: 'blue',
    href: '/analytics',
    badge: 'Donnees',
  },
]

const faceInFilmFeatures = [
  {
    icon: Scan,
    title: 'Votre Visage dans le Film',
    description: 'Uploadez un selfie et notre IA vous integre dans les scenes du film. Vous devenez le personnage.',
  },
  {
    icon: Users,
    title: 'Casting Famille & Amis',
    description: "Mettez vos proches dans le film. Offrez-leur un role pour leur anniversaire, un mariage, Noel.",
  },
  {
    icon: Crown,
    title: 'Choisissez Votre Role',
    description: 'Hero, vilain, figurant... Choisissez votre role et le film est genere avec vous dedans.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Creatrice de contenu',
    text: "J'ai contribue a 3 films et je suis creditee au generique de chacun. C'est une experience unique.",
    rating: 5,
  },
  {
    name: 'Thomas K.',
    role: 'Designer VFX',
    text: "La validation IA est incroyablement rapide. Je soumets mon travail et j'ai un retour en 30 secondes.",
    rating: 5,
  },
  {
    name: 'Leah B.',
    role: 'Prompt Engineer',
    text: "J'ai gagne 2000 Lumens en un mois. La plateforme est intuitive et la communaute est geniale.",
    rating: 5,
  },
]

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'pour toujours',
    description: 'Commencez gratuitement',
    features: ['5 taches/mois', '10 Lumens offerts', 'Streaming basique', 'Credit au generique'],
    notIncluded: ['Createur IA', 'Analytics Pro', 'Collabs illimitees'],
    featured: false,
    cta: 'Commencer',
  },
  {
    name: 'Starter',
    price: '9',
    period: '/mois',
    description: 'Pour les creatifs actifs',
    features: ['25 taches/mois', '100 Lumens/mois', 'Streaming HD', 'Createur IA basique', 'Credit au generique'],
    notIncluded: ['Analytics Pro', 'Collabs illimitees'],
    featured: false,
    cta: 'Essai gratuit',
  },
  {
    name: 'Pro',
    price: '29',
    period: '/mois',
    description: 'Le choix des pros',
    features: [
      'Taches illimitees',
      '500 Lumens/mois',
      'Streaming 4K',
      'Createur IA complet',
      'Analytics Pro',
      'Collabs illimitees',
      'Support prioritaire',
    ],
    notIncluded: [],
    featured: true,
    cta: 'Choisir Pro',
  },
  {
    name: 'Business',
    price: '99',
    period: '/mois',
    description: 'Pour les studios',
    features: [
      'Tout de Pro',
      '2000 Lumens/mois',
      'API access',
      'White label',
      'Account manager',
      'Facturation entreprise',
      'SLA garanti',
    ],
    notIncluded: [],
    featured: false,
    cta: 'Contacter',
  },
]

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default async function HomePage() {
  const [stats, films] = await Promise.all([getStats(), getFilmsInProduction()])

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-white">
      <Header />

      {/* ================================================================ */}
      {/* GLOBAL BACKGROUND — decorative ambient blurs                     */}
      {/* ================================================================ */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#D4AF37]/[0.04] blur-[180px]" />
        <div className="absolute top-[40%] right-0 w-[500px] h-[500px] rounded-full bg-purple-900/[0.08] blur-[150px]" />
        <div className="absolute bottom-[20%] left-0 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/[0.03] blur-[120px]" />
      </div>

      {/* ================================================================ */}
      {/* 1. HERO                                                          */}
      {/* ================================================================ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
        {/* CSS Gold accent lines — decorative grid */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Vertical gold lines */}
          <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-[#D4AF37]/[0.07] to-transparent" />
          <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-[#D4AF37]/[0.05] to-transparent" />
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-[#D4AF37]/[0.07] to-transparent" />
          <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-[#D4AF37]/[0.05] to-transparent" />
          {/* Horizontal gold lines */}
          <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/[0.06] to-transparent" />
          <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/[0.06] to-transparent" />
          {/* Corner accents */}
          <div className="absolute top-16 left-8 w-24 h-24 border-l border-t border-[#D4AF37]/[0.1] rounded-tl-3xl" />
          <div className="absolute top-16 right-8 w-24 h-24 border-r border-t border-[#D4AF37]/[0.1] rounded-tr-3xl" />
          <div className="absolute bottom-16 left-8 w-24 h-24 border-l border-b border-[#D4AF37]/[0.1] rounded-bl-3xl" />
          <div className="absolute bottom-16 right-8 w-24 h-24 border-r border-b border-[#D4AF37]/[0.1] rounded-br-3xl" />
          {/* Radial glow behind headline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/[0.04] blur-[100px]" />
          {/* Animated gold particles — pure CSS */}
          <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-[#D4AF37]/40 animate-pulse" />
          <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-[#D4AF37]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[70%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#D4AF37]/35 animate-pulse [animation-delay:1.5s]" />
          <div className="absolute top-[45%] left-[40%] w-0.5 h-0.5 rounded-full bg-[#D4AF37]/20 animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[35%] right-[35%] w-1 h-1 rounded-full bg-[#D4AF37]/30 animate-pulse [animation-delay:0.8s]" />
          <div className="absolute bottom-[30%] left-[50%] w-1 h-1 rounded-full bg-[#D4AF37]/25 animate-pulse [animation-delay:1.3s]" />
          <div className="absolute top-[50%] right-[45%] w-0.5 h-0.5 rounded-full bg-[#D4AF37]/20 animate-pulse [animation-delay:0.3s]" />
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-sm text-[#D4AF37] mb-10 backdrop-blur-sm">
          <Clapperboard className="h-4 w-4" />
          <span className="font-medium">Plateforme de Cinema IA Collaboratif</span>
        </div>

        {/* Headline */}
        <h1
          className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-8 max-w-6xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          <span className="block">Vous Aussi,</span>
          <span className="block mt-2">
            Soyez{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Createurs
            </span>
          </span>
          <span className="block mt-2">
            de{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Cinema
            </span>
          </span>
        </h1>

        {/* Subline */}
        <p className="relative text-lg sm:text-xl md:text-2xl text-white/50 max-w-3xl mb-12 leading-relaxed px-4">
          La premiere plateforme ou chaque utilisateur est co-createur et credite au generique.
          Contribuez des micro-taches, l'IA assemble vos contributions en films cinematographiques.
        </p>

        {/* CTA Buttons */}
        <div className="relative flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/register">
            <Button size="xl" className="group text-base sm:text-lg px-8 sm:px-12">
              Commencer Gratuitement
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/streaming">
            <Button size="xl" variant="outline" className="text-base sm:text-lg px-8 sm:px-12">
              <Play className="h-5 w-5" />
              Voir le Catalogue
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8">
            {[
              { label: 'Contributeurs', value: stats.usersCount > 0 ? `${stats.usersCount}+` : '500+', icon: Users },
              { label: 'Films en Production', value: stats.filmsCount > 0 ? `${stats.filmsCount}` : '12', icon: Film },
              { label: 'Taches Validees', value: stats.tasksValidated > 0 ? `${stats.tasksValidated.toLocaleString('fr-FR')}` : '2 400+', icon: CheckCircle },
              { label: 'Tokens Distribues', value: stats.lumensTx > 0 ? `${stats.lumensTx.toLocaleString('fr-FR')}` : '18 000+', icon: Coins },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mx-auto mb-1">
                  <stat.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D4AF37]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Decouvrir</span>
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. HOW IT WORKS                                                  */}
      {/* ================================================================ */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/50 mb-6">
              <Rocket className="h-3.5 w-3.5 text-[#D4AF37]" />
              Simple & Puissant
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Comment ca{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Marche
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              De l'inscription au credit au generique, en 4 etapes simples.
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {howItWorksSteps.map((step, i) => (
              <div key={step.number} className="relative group">
                {/* Connector line (hidden on last) */}
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-[#D4AF37]/20 to-transparent z-0" />
                )}
                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8 hover:border-[#D4AF37]/20 hover:bg-white/[0.05] transition-all duration-500 h-full">
                  {/* Step number watermark */}
                  <span
                    className="absolute top-4 right-4 text-6xl font-bold text-white/[0.03] select-none"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {step.number}
                  </span>
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                    <step.icon className="h-7 w-7 text-[#D4AF37]" />
                  </div>
                  {/* Label */}
                  <div className="text-xs text-[#D4AF37]/60 uppercase tracking-widest font-medium mb-3">
                    Etape {step.number}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. MODULES SHOWCASE                                              */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 relative">
        {/* Section bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] via-transparent to-white/[0.01] pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/50 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              5 Modules Integres
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Un Ecosysteme{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Complet
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Produisez, creez, diffusez, collaborez et analysez — tout en un seul endroit.
            </p>
          </div>

          {/* Module cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <Link key={mod.title} href={mod.href} className="group">
                <div
                  className="relative rounded-2xl border bg-white/[0.03] p-6 sm:p-8 h-full transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    borderColor: `${mod.color}15`,
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at center, ${mod.color}08 0%, transparent 70%)`,
                    }}
                  />
                  {/* Badge */}
                  <span
                    className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full mb-5"
                    style={{
                      color: mod.color,
                      backgroundColor: `${mod.color}15`,
                      border: `1px solid ${mod.color}25`,
                    }}
                  >
                    {mod.badge}
                  </span>
                  {/* Icon */}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-colors duration-300"
                    style={{
                      backgroundColor: `${mod.color}15`,
                      border: `1px solid ${mod.color}25`,
                    }}
                  >
                    <mod.icon className="h-7 w-7" style={{ color: mod.color }} />
                  </div>
                  {/* Content */}
                  <h3
                    className="text-xl font-bold mb-3 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    <span className="group-hover:text-white">{mod.title}</span>
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm mb-5">{mod.description}</p>
                  {/* Link */}
                  <div
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                    style={{ color: mod.color }}
                  >
                    Decouvrir
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}

            {/* 6th card — Join CTA */}
            <div className="relative rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.08] to-[#D4AF37]/[0.02] p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 mb-5">
                <Rocket className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <h3
                className="text-xl font-bold mb-3 text-[#D4AF37]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Et bien plus...
              </h3>
              <p className="text-white/40 text-sm mb-6 leading-relaxed">
                De nouvelles fonctionnalites chaque mois. Face in Film, IA vocale, NFT credits...
              </p>
              <Link href="/roadmap">
                <Button variant="outline" size="sm" className="group">
                  Voir la Roadmap
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. COMING SOON: FACE IN FILM                                     */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-purple-900/[0.08] blur-[150px]" />
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-[#D4AF37]/[0.05] blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400 mb-8">
                <Clock className="h-3.5 w-3.5" />
                Coming 2026
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Mettez Votre{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #A855F7 0%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Visage
                </span>{' '}
                dans le Film
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-lg">
                Bientot, vous pourrez vous integrer dans n'importe quel film de la plateforme.
                Choisissez votre role, uploadez votre photo, et l'IA fait le reste.
                Offrez un role a vos proches pour un moment inoubliable.
              </p>
              <div className="space-y-5">
                {faceInFilmFeatures.map((feat) => (
                  <div key={feat.title} className="flex gap-4 items-start">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <feat.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white/90 mb-1">{feat.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/register">
                  <Button size="lg" className="group">
                    Etre notifie du lancement
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: visual mock */}
            <div className="relative">
              {/* Main card */}
              <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10">
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-purple-600 to-[#D4AF37] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  COMING 2026
                </div>
                {/* Film frame mock */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] aspect-video mb-6 border border-white/5">
                  {/* Scan lines */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)]" />
                  {/* Face placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-[#D4AF37]/40 flex items-center justify-center">
                        <Scan className="h-8 w-8 sm:h-12 sm:w-12 text-[#D4AF37]/50" />
                      </div>
                      {/* Scanning animation rings */}
                      <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute -inset-3 rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#D4AF37]/30 rounded-tl" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#D4AF37]/30 rounded-tr" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#D4AF37]/30 rounded-bl" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#D4AF37]/30 rounded-br" />
                  {/* Film info overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest mb-1">Role : Personnage Principal</div>
                    <div className="text-white/60 text-xs">Votre visage sera integre ici par l'IA</div>
                  </div>
                </div>
                {/* Feature chips */}
                <div className="flex flex-wrap gap-2">
                  {['Deep Personalization', 'HD Quality', 'Instant Preview', 'Gift Mode'].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1 text-xs rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 text-white/40"
                    >
                      <Sparkles className="h-3 w-3 text-purple-400" />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              {/* Floating accent shapes */}
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-[#D4AF37]/20 border border-white/5 backdrop-blur-sm flex items-center justify-center">
                <Heart className="h-5 w-5 text-purple-400/60" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-purple-500/20 border border-white/5 backdrop-blur-sm flex items-center justify-center">
                <Star className="h-4 w-4 text-[#D4AF37]/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. FILMS IN PRODUCTION                                           */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/50 mb-6">
                <Film className="h-3.5 w-3.5 text-[#D4AF37]" />
                En cours de production
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Films en{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Production
                </span>
              </h2>
              <p className="text-white/40 text-lg">
                Rejoignez l'equipe et contribuez des maintenant a un film.
              </p>
            </div>
            <Link
              href="/films"
              className="hidden sm:flex items-center gap-2 text-[#D4AF37] hover:text-[#F0D060] transition-colors text-sm font-medium shrink-0"
            >
              Voir tous les films <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Films grid */}
          {films.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.slug}`}>
                  <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden hover:border-[#D4AF37]/20 transition-all duration-500 h-full">
                    {/* Poster */}
                    <div className="relative h-48 sm:h-52 bg-gradient-to-br from-[#D4AF37]/[0.08] to-purple-900/20 overflow-hidden">
                      {film.coverImageUrl ? (
                        <img
                          src={film.coverImageUrl}
                          alt={film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="relative">
                            <Film className="h-16 w-16 text-[#D4AF37]/20" />
                            <div className="absolute inset-0 blur-xl bg-[#D4AF37]/10" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] uppercase tracking-wider font-medium text-white/70 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                          {FILM_STATUS_LABELS[film.status]}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-lg mb-2 group-hover:text-[#D4AF37] transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {film.title}
                      </h3>
                      {film.description && (
                        <p className="text-sm text-white/35 mb-5 line-clamp-2 leading-relaxed">{film.description}</p>
                      )}
                      {/* Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Progression</span>
                          <span className="text-[#D4AF37] font-semibold">{Math.round(film.progressPct)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all duration-1000"
                            style={{ width: `${film.progressPct}%` }}
                          />
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                        <span className="text-xs text-white/30">{film._count.tasks} taches</span>
                        <span className="text-xs text-[#D4AF37] flex items-center gap-1 group-hover:gap-2 transition-all">
                          Contribuer <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <Film className="h-16 w-16 text-[#D4AF37]/20 mx-auto mb-4" />
              <p className="text-white/40 mb-6">Les films seront bientot disponibles.</p>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Etre notifie <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile link */}
          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/films"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F0D060] transition-colors text-sm font-medium"
            >
              Voir tous les films <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. SOCIAL PROOF / TRUST                                          */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/[0.02] to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/50 mb-6">
              <Shield className="h-3.5 w-3.5 text-[#D4AF37]" />
              Confiance & Resultats
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Ils nous font{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Confiance
              </span>
            </h2>
          </div>

          {/* Big numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '1M+', label: 'Vues generees' },
              { value: '500+', label: 'Createurs actifs' },
              { value: '98%', label: 'Taux de satisfaction' },
              { value: '24h', label: 'Temps moyen de paiement' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div
                  className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8 relative"
              >
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-[#D4AF37]/10 absolute top-6 right-6" />
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                {/* Text */}
                <p className="text-white/50 leading-relaxed mb-6 text-sm italic">
                  &laquo; {t.text} &raquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white/70">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/80">{t.name}</div>
                    <div className="text-xs text-white/35">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Backed by / Press logos placeholder */}
          <div className="text-center">
            <p className="text-xs text-white/25 uppercase tracking-widest mb-8">Ils parlent de nous</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {['TechCrunch', 'Les Echos', 'Wired', 'Le Monde', 'Variety'].map((name) => (
                <div
                  key={name}
                  className="text-white/[0.12] text-lg sm:text-xl font-bold tracking-wider hover:text-white/20 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. VIRAL CTA — Referral                                          */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.06] via-[#D4AF37]/[0.02] to-purple-900/[0.04] p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Decorative bg elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D4AF37]/[0.05] blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-purple-500/[0.05] blur-[60px] pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              {/* Left text */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-sm text-[#D4AF37] mb-6">
                  <Gift className="h-3.5 w-3.5" />
                  Programme de Parrainage
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-5 leading-tight"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Invitez vos Amis,{' '}
                  <span className="text-[#D4AF37]">Gagnez des Tokens</span>
                </h2>
                <p className="text-white/40 leading-relaxed mb-8">
                  Pour chaque ami qui rejoint Lumiere, vous recevez{' '}
                  <span className="text-[#D4AF37] font-semibold">30 Lumens</span> et votre ami aussi.
                  Doublez vos tokens, construisez votre equipe de createurs.
                </p>
                <Link href="/register">
                  <Button size="lg" className="group">
                    <UserPlus className="h-5 w-5" />
                    Obtenir mon Lien de Parrainage
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Right visual */}
              <div className="flex flex-col gap-4">
                {/* Reward card 1 */}
                <div className="rounded-xl border border-[#D4AF37]/15 bg-white/[0.03] p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/25">
                    <Gift className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80 mb-0.5">Vous parrainez</div>
                    <div className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>+30 Lumens</div>
                    <div className="text-xs text-white/35">Credites instantanement</div>
                  </div>
                </div>
                {/* Reward card 2 */}
                <div className="rounded-xl border border-purple-500/15 bg-white/[0.03] p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/25">
                    <Heart className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80 mb-0.5">Votre ami recoit</div>
                    <div className="text-2xl font-bold text-purple-400" style={{ fontFamily: 'var(--font-playfair)' }}>+30 Lumens</div>
                    <div className="text-xs text-white/35">Des son inscription</div>
                  </div>
                </div>
                {/* Bonus info */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                  <p className="text-xs text-white/35">
                    <span className="text-[#D4AF37] font-semibold">Bonus x2</span> — Parrainez 10 amis et recevez un bonus de 100 Lumens supplementaires
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. PRICING TEASER                                                */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/50 mb-6">
              <Coins className="h-3.5 w-3.5 text-[#D4AF37]" />
              Tarification Simple
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Un Plan pour{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Chacun
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Commencez gratuitement, evoluez quand vous etes pret.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 sm:p-7 flex flex-col h-full transition-all duration-300 ${
                  plan.featured
                    ? 'border-[#D4AF37]/40 bg-[#D4AF37]/[0.06] scale-[1.02] shadow-[0_0_40px_rgba(212,175,55,0.1)]'
                    : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold bg-gradient-to-r from-[#D4AF37] to-[#F0D060] text-black px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                {/* Plan name */}
                <div className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">{plan.name}</div>
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className={`text-4xl sm:text-5xl font-bold ${plan.featured ? 'text-[#D4AF37]' : 'text-white'}`}
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {plan.price}€
                  </span>
                  <span className="text-sm text-white/30">{plan.period}</span>
                </div>
                <p className="text-xs text-white/35 mb-6">{plan.description}</p>
                {/* Features */}
                <div className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="text-white/60">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <X className="h-4 w-4 text-white/15 shrink-0 mt-0.5" />
                      <span className="text-white/25">{f}</span>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <Link href="/subscription" className="w-full">
                  <Button
                    variant={plan.featured ? 'default' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-white/25 mt-8">
            Tous les plans incluent le credit au generique. Annulation possible a tout moment.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. FINAL CTA                                                     */}
      {/* ================================================================ */}
      <section className="relative py-32 sm:py-40 px-4 overflow-hidden">
        {/* Gold gradient bg */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/[0.06] to-[#D4AF37]/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#D4AF37]/[0.08] blur-[120px]" />
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/25 mb-8">
            <Clapperboard className="h-8 w-8 text-[#D4AF37]" />
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Rejoignez la{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Revolution
            </span>
            <br />
            du Cinema IA
          </h2>

          <p className="text-xl text-white/45 mb-12 max-w-2xl mx-auto leading-relaxed">
            Des milliers de createurs construisent le cinema de demain.
            Votre talent merite d'etre au generique. Commencez aujourd'hui, c'est gratuit.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register">
              <Button size="xl" className="group text-base sm:text-lg px-10 sm:px-14">
                Creer mon Compte Gratuit
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-white/25">
            Inscription gratuite — Pas de carte bancaire requise — Acces immediat
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. FOOTER                                                       */}
      {/* ================================================================ */}
      <Footer />
    </div>
  )
}
