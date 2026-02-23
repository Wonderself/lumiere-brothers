import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Film, Video, Users, Settings,
  Coins, Star, TrendingUp,
  Tv, Wand2, Handshake, ChartLine,
  ArrowRight, Crown, CheckCircle2, Clock,
  EyeOff, Calendar, UserPlus,
  Vote, Scale, CircleDollarSign,
  Building2, CreditCard, Key, ShieldCheck,
  Landmark, Globe, Server, ExternalLink,
  AlertCircle, Square, ChevronRight
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      creatorProfile: true,
      _count: {
        select: {
          submissions: true,
          catalogFilms: true,
          sentCollabs: true,
          receivedCollabs: true,
          referralsMade: true,
        },
      },
    },
  })

  if (!user) redirect('/login')

  // Get recent videos count
  const videosCount = user.creatorProfile
    ? await prisma.generatedVideo.count({ where: { profileId: user.creatorProfile.id } })
    : 0

  const publishedVideos = user.creatorProfile
    ? await prisma.generatedVideo.count({ where: { profileId: user.creatorProfile.id, status: 'PUBLISHED' } })
    : 0

  // Pending collabs
  const pendingCollabs = await prisma.collabRequest.count({
    where: { toUserId: user.id, status: 'PENDING' },
  })

  // Active orders
  const activeOrders = await prisma.videoOrder.count({
    where: {
      OR: [
        { clientUserId: user.id },
        { creatorUserId: user.id },
      ],
      status: { in: ['CLAIMED', 'IN_PROGRESS', 'DELIVERED'] },
    },
  })

  // Tokenization data
  const tokenPurchases = await prisma.filmTokenPurchase.findMany({
    where: { userId: user.id, status: 'CONFIRMED' },
    select: { tokenCount: true },
  })
  const totalTokensHeld = tokenPurchases.reduce((sum, p) => sum + p.tokenCount, 0)

  const pendingDividends = await prisma.tokenDividend.count({
    where: { userId: user.id, status: 'PENDING' },
  })

  const activeProposals = await prisma.governanceProposal.count({
    where: {
      status: 'ACTIVE',
      deadline: { gt: new Date() },
    },
  })

  // Check if user has voted on active proposals
  const userVotesOnActive = await prisma.governanceVote.count({
    where: {
      userId: user.id,
      proposal: { status: 'ACTIVE', deadline: { gt: new Date() } },
    },
  })
  const unvotedProposals = activeProposals - userVotesOnActive

  const isAdmin = user.role === 'ADMIN'
  const hasCreatorProfile = !!user.creatorProfile

  const now = new Date()
  const frenchDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm capitalize mb-1">{frenchDate}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Bonjour, {user.displayName || 'Créateur'}
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm">Votre hub central</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Crown className="h-3 w-3 mr-1" />
            {user.level}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-gray-900 text-sm font-semibold">{user.lumenBalance}</span>
            <span className="text-gray-400 text-xs">Lumens</span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Tâches complétées', value: user.tasksCompleted, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Vidéos créées', value: videosCount, icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Réputation', value: `${user.reputationScore}/100`, icon: Star, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
          { label: 'Points', value: user.points, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Tokens Film', value: totalTokensHeld, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-h-[52px]">
              <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 text-lg sm:text-xl font-bold leading-tight truncate">{kpi.value}</p>
                <p className="text-gray-400 text-[11px] sm:text-xs mt-0.5 truncate">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(pendingCollabs > 0 || activeOrders > 0 || pendingDividends > 0 || unvotedProposals > 0) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {pendingCollabs > 0 && (
            <Link href="/collabs" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl hover:border-yellow-300 transition-all p-4 flex items-center gap-3">
                <Handshake className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700 text-sm">{pendingCollabs} collab(s) en attente</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          )}
          {activeOrders > 0 && (
            <Link href="/collabs/orders" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl hover:border-blue-300 transition-all p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 text-sm">{activeOrders} commande(s) active(s)</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          )}
          {pendingDividends > 0 && (
            <Link href="/tokenization/portfolio" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl hover:border-amber-300 transition-all p-4 flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-amber-500" />
                <span className="text-gray-700 text-sm">{pendingDividends} dividende(s) à réclamer</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          )}
          {unvotedProposals > 0 && (
            <Link href="/tokenization/governance" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl hover:border-purple-300 transition-all p-4 flex items-center gap-3">
                <Vote className="h-5 w-5 text-purple-500" />
                <span className="text-gray-700 text-sm">{unvotedProposals} vote(s) en attente</span>
                <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Module 1 — Studio Films */}
        <Link href="/tasks">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Film className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-[#D4AF37] transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Studio Films</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Micro-tâches cinéma, VFX, doublage, montage.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs">{user.tasksCompleted} tâches</span>
              <span className="text-gray-200">|</span>
              <span className="text-gray-400 text-xs">{user.tasksValidated} validées</span>
            </div>
          </div>
        </Link>

        {/* Module 2 — Créateur IA */}
        <Link href={hasCreatorProfile ? '/creator' : '/creator/wizard'}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-purple-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-purple-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Créateur IA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {hasCreatorProfile
                ? 'Générez des vidéos IA, planifiez, publiez.'
                : 'Créez votre profil créateur pour commencer.'}
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              {hasCreatorProfile ? (
                <>
                  <span className="text-purple-500 text-xs">{videosCount} vidéos</span>
                  <span className="text-gray-200">|</span>
                  <span className="text-green-500 text-xs">{publishedVideos} publiées</span>
                </>
              ) : (
                <span className="text-yellow-500 text-xs">Profil non créé</span>
              )}
            </div>
          </div>
        </Link>

        {/* Module 3 — Collabs & Growth */}
        <Link href="/collabs">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center">
                <Handshake className="h-5 w-5 text-green-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Collabs & Growth</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Marketplace, commandes, parrainages.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs">{user._count.sentCollabs + user._count.receivedCollabs} collabs</span>
              <span className="text-gray-200">|</span>
              <span className="text-gray-400 text-xs">{user._count.referralsMade} filleuls</span>
            </div>
          </div>
        </Link>

        {/* Module 4 — Analytics */}
        <Link href="/analytics">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <ChartLine className="h-5 w-5 text-blue-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Performance, revenus, engagement unifié.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-blue-500 text-xs">Temps réel</span>
            </div>
          </div>
        </Link>

        {/* Streaming */}
        <Link href="/streaming">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
                <Tv className="h-5 w-5 text-red-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-red-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Streaming</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Soumettez et regardez les films IA.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs">{user._count.catalogFilms} films soumis</span>
            </div>
          </div>
        </Link>

        {/* Module 6 — Investissement */}
        <Link href="/tokenization">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-gray-900 font-semibold text-base">Investissement</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Tokens de films, dividendes, gouvernance.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-amber-500 text-xs">{totalTokensHeld} tokens</span>
              {pendingDividends > 0 && (
                <>
                  <span className="text-gray-200">|</span>
                  <span className="text-green-500 text-xs">{pendingDividends} dividende(s)</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Admin (admin only) */}
        {isAdmin && (
          <Link href="/admin">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-orange-500" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-gray-900 font-semibold text-base">Administration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Utilisateurs, catalogue, payouts.</p>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Générer une vidéo', href: '/creator/generate', icon: Wand2, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Voir le planning', href: '/creator/schedule', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'NoFace Studio', href: '/creator/noface', icon: EyeOff, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          { label: 'Inviter un ami', href: '/collabs/referrals', icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 p-4 rounded-xl ${action.bg} border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all min-h-[56px] group`}
          >
            <action.icon className={`h-5 w-5 shrink-0 ${action.color}`} />
            <span className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Launch Checklist — Admin Only */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-gray-900 text-lg font-bold font-[family-name:var(--font-playfair)]">
                  Checklist de Lancement
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Actions requises avant la mise en production
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-2">
              {([
                {
                  title: 'Créer une entité légale en Israel (Ltd)',
                  icon: Building2,
                  helper: 'HUMAN',
                  needsAttention: true,
                  link: 'https://www.gov.il/en/departments/topics/companies-registrar',
                },
                {
                  title: 'Ouvrir un compte bancaire professionnel',
                  icon: Landmark,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Configurer Stripe Connect pour les paiements',
                  icon: CreditCard,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Obtenir les clés API (Claude, ElevenLabs, Runway)',
                  icon: Key,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Souscrire à un KYC provider (Sumsub)',
                  icon: ShieldCheck,
                  helper: 'BOTH',
                  needsAttention: true,
                },
                {
                  title: 'Demander le sandbox ISA pour les tokens',
                  icon: Scale,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Domaine + Cloudflare',
                  icon: Globe,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
                {
                  title: 'Déployer sur Coolify/Hetzner',
                  icon: Server,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
              ] as const).map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <Square className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#D4AF37]/60' : 'text-gray-200'}`} />
                  <item.icon className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#D4AF37]' : 'text-gray-300'}`} />
                  <span className={`text-sm flex-1 min-w-0 ${item.needsAttention ? 'text-gray-700' : 'text-gray-400'}`}>
                    {item.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 h-4 shrink-0 ${
                      item.helper === 'CLAUDE'
                        ? 'border-purple-200 text-purple-500'
                        : item.helper === 'HUMAN'
                        ? 'border-orange-200 text-orange-500'
                        : 'border-blue-200 text-blue-500'
                    }`}
                  >
                    {item.helper === 'CLAUDE' ? 'Claude' : item.helper === 'HUMAN' ? 'Humain' : 'Les deux'}
                  </Badge>
                  {'link' in item && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
