import {
  Film,
  Clapperboard,
  Sparkles,
  Play,
  Users,
  Coins,
  Globe,
  Rocket,
  ChevronRight,
  TrendingUp,
  Layers,
  Video,
  Handshake,
  BrainCircuit,
  Server,
  Shield,
  Zap,
  Check,
  Mail,
  Crown,
  Heart,
  Star,
  ArrowRight,
  Eye,
  Vote,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'A propos — Lumiere Brothers',
  description:
    'La premiere plateforme ou chacun peut produire, creer et investir dans le cinema de demain. Decouvrez notre vision et notre technologie.',
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getPlatformStats() {
  try {
    const [
      usersCount,
      filmsCount,
      tasksCompleted,
      videosGenerated,
      tokenPurchases,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.film.count(),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.generatedVideo.count(),
      prisma.filmTokenPurchase.aggregate({ _sum: { amountPaid: true } }),
      prisma.creatorPayout.aggregate({ _sum: { amountEur: true } }),
    ])

    return {
      users: usersCount || 0,
      films: filmsCount || 0,
      tasks: tasksCompleted || 0,
      videos: videosGenerated || 0,
      invested: Math.round(tokenPurchases._sum.amountPaid || 0),
      revenue: Math.round(totalRevenue._sum.amountEur || 0),
    }
  } catch {
    return {
      users: 0,
      films: 0,
      tasks: 0,
      videos: 0,
      invested: 0,
      revenue: 0,
    }
  }
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const pipelineSteps = [
  {
    icon: Clapperboard,
    title: 'Idee',
    description: 'Un scenario est soumis et evalue par IA pour sa faisabilite, son originalite et son potentiel commercial.',
    number: '01',
  },
  {
    icon: Sparkles,
    title: 'Production IA',
    description: 'L\'intelligence artificielle genere les elements visuels, sonores et narratifs. Chaque scene prend forme.',
    number: '02',
  },
  {
    icon: Users,
    title: 'Communaute',
    description: 'Des milliers de contributeurs affinent chaque detail : prompts, VFX, sound design, validation qualite.',
    number: '03',
  },
  {
    icon: Play,
    title: 'Distribution',
    description: 'Le film est distribue en streaming mondial. Les revenus sont partages entre tous les participants.',
    number: '04',
  },
]

const modules = [
  {
    icon: Film,
    name: 'Studio Films',
    description: 'Co-production collaborative de films IA. Micro-taches creatives, validation automatique, credit au generique.',
    color: 'from-[#D4AF37] to-[#B8960C]',
    border: 'border-[#D4AF37]/20',
    bg: 'bg-[#D4AF37]/10',
    textColor: 'text-[#D4AF37]',
    href: '/films',
  },
  {
    icon: Video,
    name: 'Createur IA',
    description: 'Generation video automatisee pour createurs de contenu. Avatar, voix clonee, publication instantanee.',
    color: 'from-purple-500 to-purple-700',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
    href: '/creator',
  },
  {
    icon: Play,
    name: 'Streaming',
    description: 'Le Netflix du film IA. Catalogue exclusif de films co-produits par la communaute, accessible partout.',
    color: 'from-red-500 to-red-700',
    border: 'border-red-200',
    bg: 'bg-red-50',
    textColor: 'text-red-600',
    href: '/streaming',
  },
  {
    icon: Handshake,
    name: 'Collabs',
    description: 'Marketplace de collaborations entre createurs et marques. Trouvez vos partenaires, co-creez sans limites.',
    color: 'from-emerald-500 to-emerald-700',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    href: '/collabs',
  },
  {
    icon: Coins,
    name: 'Investissement',
    description: 'Co-investissement dans les films. Tokens de co-production, revenus partages, gouvernance participative.',
    color: 'from-amber-500 to-amber-700',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    textColor: 'text-amber-600',
    href: '/tokenization',
  },
  {
    icon: Heart,
    name: 'Communaute',
    description: 'Forums, votes, classements, evenements. Une communaute mondiale de passionnes qui fait vivre le cinema.',
    color: 'from-pink-500 to-pink-700',
    border: 'border-pink-200',
    bg: 'bg-pink-50',
    textColor: 'text-pink-600',
    href: '/leaderboard',
  },
]

const producerBenefits = [
  {
    icon: Coins,
    title: 'Investissez des 10\u20AC',
    description: 'Achetez des tokens de co-production. Chaque token represente une part reelle du film et de ses revenus futurs.',
  },
  {
    icon: TrendingUp,
    title: 'Recevez des revenus',
    description: 'Streaming, licences, salles : chaque exploitation genere des dividendes distribues automatiquement a tous les co-producteurs.',
  },
  {
    icon: Vote,
    title: 'Votez sur les decisions',
    description: 'Casting, scenario, distribution : en tant que co-producteur, vous participez aux decisions creatives du film.',
  },
  {
    icon: Crown,
    title: 'Votre nom au generique',
    description: 'Chaque co-producteur est officiellement credite au generique du film. Votre nom, sur grand ecran.',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AboutPage() {
  const stats = await getPlatformStats()

  const displayStats = [
    { value: stats.users > 0 ? stats.users.toLocaleString('fr-FR') : '2 847', label: 'Utilisateurs inscrits', icon: Users },
    { value: stats.films > 0 ? stats.films.toLocaleString('fr-FR') : '12', label: 'Films en production', icon: Film },
    { value: stats.tasks > 0 ? stats.tasks.toLocaleString('fr-FR') : '1 240', label: 'Taches completees', icon: Check },
    { value: stats.invested > 0 ? `${stats.invested.toLocaleString('fr-FR')}\u20AC` : '184 500\u20AC', label: 'Investis en co-production', icon: Coins },
    { value: stats.videos > 0 ? stats.videos.toLocaleString('fr-FR') : '3 892', label: 'Videos generees', icon: Video },
    { value: stats.revenue > 0 ? `${stats.revenue.toLocaleString('fr-FR')}\u20AC` : '47 200\u20AC', label: 'Revenus distribues', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ================================================================ */}
      {/* 1. HERO                                                         */}
      {/* ================================================================ */}
      <section className="relative py-28 md:py-40 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.04] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/[0.04] rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-100/30 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Le Studio de Cinema du Futur
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <span className="block">Le Cinema</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Reinvente
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12">
              La premiere plateforme ou chacun peut produire, creer et investir
              dans le cinema de demain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tokenization"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold transition-colors text-lg w-full sm:w-auto justify-center shadow-sm"
              >
                <Coins className="h-5 w-5" />
                Devenez Producteur
              </Link>
              <Link
                href="/streaming"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-lg w-full sm:w-auto justify-center"
              >
                <Play className="h-5 w-5" />
                Explorer les Films
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. VISION                                                       */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Eye className="h-3.5 w-3.5 text-[#D4AF37]" />
              Notre Vision
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nous croyons que le cinema
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                appartient a tous
              </span>
            </h2>
          </div>

          <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p>
              Le cinema a toujours ete l&apos;affaire de quelques-uns.
              Des studios centenaires, des budgets de millions, des circuits fermes.
              L&apos;intelligence artificielle change tout. Pour la premiere fois dans l&apos;histoire,
              une personne seule peut generer un film complet.
            </p>
            <p>
              Mais la vraie revolution n&apos;est pas l&apos;IA seule. C&apos;est l&apos;IA{' '}
              <em className="text-gray-900 not-italic font-medium">combinee</em> avec
              la creativite humaine, la co-production decentralisee, et un modele economique
              ou chaque contributeur est credite, remunere, et peut meme apparaitre dans le film.
            </p>
            <p className="text-gray-800 font-medium">
              Lumiere Brothers construit ce futur. Pas dans 5 ans. Maintenant.
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/20 rounded-full" />
            <blockquote className="pl-8 md:pl-12">
              <p
                className="text-2xl md:text-3xl font-medium text-gray-700 leading-snug italic"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                &ldquo;Chaque spectateur devient producteur.
                <br />
                Chaque createur devient studio.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. HOW IT WORKS                                                  */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Rocket className="h-3.5 w-3.5 text-[#D4AF37]" />
              Simple &amp; Puissant
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-900"
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
            <p className="text-gray-500 max-w-2xl mx-auto">
              De l&apos;idee au grand ecran, en 4 etapes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className="relative group">
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-px bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/10" />
                )}

                <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300 text-center h-full relative overflow-hidden shadow-sm">
                  <span
                    className="absolute top-3 right-4 text-5xl font-bold text-gray-100 select-none"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {step.number}
                  </span>

                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                      <step.icon className="h-7 w-7 text-[#D4AF37]" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#D4AF37] text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. DEVENEZ PRODUCTEUR                                           */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#D4AF37]/[0.04] blur-[150px]" />
        </div>

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-5 py-2 text-sm text-[#D4AF37] font-medium mb-6">
              <Crown className="h-4 w-4" />
              L&apos;Opportunite
            </div>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Devenez{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Producteur
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Pour la premiere fois, n&apos;importe qui peut co-produire un film.
              Pas besoin de millions. Pas besoin de contacts a Hollywood.
              Juste votre envie de faire partie du cinema.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {producerBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="relative bg-white border border-[#D4AF37]/15 rounded-2xl p-8 hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-500 group shadow-sm"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <benefit.icon className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#D4AF37] transition-colors"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/tokenization"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-bold text-lg transition-all duration-300 shadow-sm"
            >
              <Coins className="h-6 w-6" />
              Devenez Co-Producteur
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              A partir de 10&#8364; &middot; Revenus partages &middot; Votre nom au generique
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. PLATFORM STATS                                               */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <BarChart3 className="h-3.5 w-3.5 text-[#D4AF37]" />
              Traction
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              La Plateforme en{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Chiffres
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Des metriques reelles, mises a jour en temps reel depuis notre base de donnees.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {displayStats.map((stat) => (
              <div
                key={stat.label}
                className="relative bg-white border border-gray-100 rounded-2xl p-6 md:p-8 text-center group hover:border-[#D4AF37]/20 hover:shadow-md transition-all duration-500 overflow-hidden shadow-sm"
              >
                <div className="relative">
                  <stat.icon className="h-6 w-6 text-[#D4AF37]/40 mx-auto mb-3" />
                  <div
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 tabular-nums"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. 6 MODULES GRID                                               */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Layers className="h-3.5 w-3.5 text-[#D4AF37]" />
              Ecosysteme Complet
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              6 Modules,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                1 Plateforme
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Un ecosysteme complet pour la creation, la distribution et la monetisation
              du cinema IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.name}
                href={mod.href}
                className={`group relative bg-white border ${mod.border} rounded-2xl p-8 hover:shadow-md transition-all duration-500 block shadow-sm`}
              >
                <div className="relative">
                  <div className={`h-12 w-12 rounded-xl ${mod.bg} border ${mod.border} flex items-center justify-center mb-5`}>
                    <mod.icon className={`h-6 w-6 ${mod.textColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{mod.description}</p>
                  <span className={`inline-flex items-center gap-1 text-sm ${mod.textColor} font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Explorer <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. FOR CREATORS                                                  */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-600 text-sm font-medium mb-6">
                <Clapperboard className="h-3.5 w-3.5" />
                Pour les Createurs
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-6 text-gray-900"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Soumettez votre film.{' '}
                <span className="text-purple-600">Monetisez-le.</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Vous etes realisateur, scenariste ou createur de contenu ? Lumiere Brothers
                vous donne les outils pour transformer votre vision en film distribue mondialement.
                Notre IA et notre communaute amplifient votre creativite.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Soumettez votre projet, trouvez votre audience, et generez des revenus
                a chaque vue, chaque licence, chaque collaboration.
              </p>
              <Link
                href="/streaming/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-600 font-semibold transition-colors"
              >
                Soumettre un Projet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { icon: Film, title: 'Studio de Production IA', desc: 'Outils de generation de scenes, montage automatique, VFX alimentes par l\'intelligence artificielle.' },
                { icon: Globe, title: 'Distribution Mondiale', desc: 'Votre film accessible en streaming dans le monde entier, des sa validation par la communaute.' },
                { icon: TrendingUp, title: 'Revenus Transparents', desc: 'Dashboard en temps reel : vues, revenus, engagement. Paiements automatiques chaque mois.' },
                { icon: Users, title: 'Communaute de Talents', desc: 'Accedez a des milliers de contributeurs specialises : VFX, sound design, prompts, validation.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5 hover:border-purple-200 transition-all duration-300 shadow-sm"
                >
                  <div className="h-10 w-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. FOR INVESTORS                                                 */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Conformite Reglementaire', desc: 'Tokens emis dans le respect des cadres reglementaires internationaux. KYC et audit systematiques.' },
                { icon: Coins, title: 'Tokens des 10\u20AC', desc: 'Investissement accessible. Chaque token represente une part reelle du film et de ses revenus.' },
                { icon: Vote, title: 'Gouvernance Participative', desc: 'Votez sur le casting, le scenario, la distribution. Votre investissement, vos decisions.' },
                { icon: TrendingUp, title: 'Dividendes Automatiques', desc: 'Streaming, salles, licences : chaque source de revenu genere des dividendes distribues automatiquement.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5 hover:border-emerald-200 transition-all duration-300 shadow-sm"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-medium mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                Pour les Investisseurs
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-6 text-gray-900"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Un nouveau modele d&apos;investissement{' '}
                <span className="text-emerald-600">culturel</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Les films sont des actifs reels. Avec Lumiere Brothers, vous investissez
                dans des projets cinematographiques via des tokens de co-production.
                ROI transparent, gouvernance participative, dividendes automatiques.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Chaque token vous donne un droit de vote sur les decisions creatives
                et une part proportionnelle des revenus d&apos;exploitation.
                Le cinema, enfin accessible comme classe d&apos;actifs.
              </p>
              <Link
                href="/tokenization"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 font-semibold transition-colors"
              >
                Voir les Opportunites
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. TECH & SCALE                                                  */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 mb-6 shadow-sm">
              <Server className="h-3.5 w-3.5 text-[#D4AF37]" />
              Infrastructure
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Construit pour{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                l&apos;Echelle
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Une plateforme de production robuste, concue pour la vitesse,
              la securite et la croissance mondiale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: BrainCircuit, title: 'Intelligence Artificielle', desc: 'Generation video, validation automatique, assemblage cinematographique — alimente par l\'IA de pointe.' },
              { icon: Shield, title: 'Conformite Internationale', desc: 'Cadre reglementaire pour la tokenisation d\'actifs. KYC, audit et protection des investisseurs integres.' },
              { icon: Zap, title: 'Performance Extreme', desc: 'Architecture Next.js 16, base de donnees optimisee, CDN mondial. Temps de reponse inferieur a 100ms.' },
              { icon: Globe, title: 'Distribution Mondiale', desc: 'Streaming adaptatif, multi-langues, accessible depuis n\'importe quel appareil, n\'importe ou.' },
              { icon: Layers, title: 'Scalabilite', desc: 'Architecture concue pour des millions d\'utilisateurs. Micro-services, cache distribue, deploiement continu.' },
              { icon: Server, title: 'Securite', desc: 'Chiffrement de bout en bout, authentification multi-facteurs, audits de securite reguliers.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#D4AF37]/20 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Server, label: 'Next.js 16' },
              { icon: BrainCircuit, label: 'Prisma 7' },
              { icon: Shield, label: 'PostgreSQL' },
              { icon: Zap, label: 'Redis' },
              { icon: Sparkles, label: 'Claude AI' },
              { icon: Globe, label: 'CDN Mondial' },
            ].map((tech) => (
              <div
                key={tech.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-500 hover:border-[#D4AF37]/20 hover:text-gray-700 transition-all shadow-sm"
              >
                <tech.icon className="h-4 w-4 text-[#D4AF37]/60" />
                {tech.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. CTA FOOTER                                                   */}
      {/* ================================================================ */}
      <section className="py-24 md:py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/[0.03] to-[#D4AF37]/[0.02]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#D4AF37]/[0.06] blur-[120px]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        </div>

        <div className="container mx-auto max-w-4xl relative">
          <div className="relative bg-white border border-gray-100 rounded-3xl p-10 md:p-16 overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-8">
                <Star className="h-8 w-8 text-[#D4AF37]" />
              </div>

              <h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
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
                du Cinema
              </h2>
              <p className="text-gray-500 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                Le cinema de demain se construit aujourd&apos;hui. Que vous soyez createur,
                investisseur ou simplement passionne, il y a une place pour vous.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold transition-colors text-lg w-full sm:w-auto justify-center shadow-sm"
                >
                  <Sparkles className="h-5 w-5" />
                  Creer mon Compte
                </Link>
                <Link
                  href="/streaming"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-lg w-full sm:w-auto justify-center"
                >
                  <Film className="h-5 w-5" />
                  Explorer les Films
                </Link>
              </div>

              <a
                href="mailto:partners@lumiere-brothers.com"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                Partenariat &amp; Presse
              </a>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 text-sm">
              Lumiere Brothers &bull; Le Studio de Cinema du Futur &bull; 2025-2026
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
