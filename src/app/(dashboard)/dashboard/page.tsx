import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Film, Video, Users, BarChart3, Settings,
  Eye, Coins, Star, TrendingUp, Zap,
  Tv, Wand2, Handshake, ChartLine,
  ArrowRight, Crown, CheckCircle2, Clock,
  EyeOff, Calendar, UserPlus,
  Vote, Scale, CircleDollarSign,
  Building2, CreditCard, Key, ShieldCheck,
  Landmark, Globe, Server, ExternalLink,
  AlertCircle, Square
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Bonjour, {user.displayName || 'Créateur'} !
          </h1>
          <p className="text-white/40 mt-1 text-sm sm:text-base">Votre hub central — tous vos modules en un coup d&apos;oeil.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Crown className="h-3 w-3 mr-1" />
            {user.level}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-white text-sm font-semibold">{user.lumenBalance}</span>
            <span className="text-white/30 text-xs">tokens</span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Tâches complétées', value: user.tasksCompleted, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Vidéos créées', value: videosCount, icon: Video, color: 'text-blue-400' },
          { label: 'Score réputation', value: `${user.reputationScore}/100`, icon: Star, color: 'text-[#D4AF37]' },
          { label: 'Points', value: user.points, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Tokens Détenus', value: totalTokensHeld, icon: Coins, color: 'text-amber-400' },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-white text-lg font-bold">{kpi.value}</p>
                <p className="text-white/30 text-xs">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {(pendingCollabs > 0 || activeOrders > 0 || pendingDividends > 0 || unvotedProposals > 0) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          {pendingCollabs > 0 && (
            <Link href="/collabs" className="flex-1 min-w-[240px]">
              <Card className="bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Handshake className="h-5 w-5 text-yellow-400" />
                  <span className="text-white text-sm">{pendingCollabs} collab(s) en attente</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
          {activeOrders > 0 && (
            <Link href="/collabs/orders" className="flex-1 min-w-[240px]">
              <Card className="bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-sm">{activeOrders} commande(s) active(s)</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
          {pendingDividends > 0 && (
            <Link href="/tokenization/portfolio" className="flex-1 min-w-[240px]">
              <Card className="bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <CircleDollarSign className="h-5 w-5 text-amber-400" />
                  <span className="text-white text-sm">{pendingDividends} dividende(s) à réclamer</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
          {unvotedProposals > 0 && (
            <Link href="/tokenization/governance" className="flex-1 min-w-[240px]">
              <Card className="bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Vote className="h-5 w-5 text-purple-400" />
                  <span className="text-white text-sm">{unvotedProposals} vote(s) en attente</span>
                  <ArrowRight className="h-4 w-4 text-white/30 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* 5 Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Module 1 — Studio Films */}
        <Link href="/tasks">
          <Card className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/30 transition-all h-full group">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <Film className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-white font-semibold">Studio Films</h3>
              <p className="text-white/30 text-xs">Micro-tâches cinéma, VFX, doublage, montage collaboratif.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Badge variant="outline" className="text-[10px] border-white/10 text-white/30">
                  {user.tasksCompleted} tâches
                </Badge>
                <Badge variant="outline" className="text-[10px] border-white/10 text-white/30">
                  {user.tasksValidated} validées
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 2 — Créateur IA */}
        <Link href={hasCreatorProfile ? '/creator' : '/creator/wizard'}>
          <Card className="bg-white/[0.03] border-white/10 hover:border-purple-500/30 transition-all h-full group">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-purple-400" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold">Créateur IA</h3>
              <p className="text-white/30 text-xs">
                {hasCreatorProfile
                  ? 'Générez des vidéos IA, planifiez, publiez multi-plateforme.'
                  : 'Créez votre profil créateur pour commencer à générer du contenu.'}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                {hasCreatorProfile ? (
                  <>
                    <Badge variant="outline" className="text-[10px] border-purple-500/20 text-purple-400">
                      {videosCount} vidéos
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400">
                      {publishedVideos} publiées
                    </Badge>
                  </>
                ) : (
                  <Badge variant="outline" className="text-[10px] border-yellow-500/20 text-yellow-400">
                    Profil non créé
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 3 — Collabs & Growth */}
        <Link href="/collabs">
          <Card className="bg-white/[0.03] border-white/10 hover:border-green-500/30 transition-all h-full group">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-green-400" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-green-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold">Collabs & Growth</h3>
              <p className="text-white/30 text-xs">Marketplace, commandes vidéo, parrainages, outreach IA.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Badge variant="outline" className="text-[10px] border-white/10 text-white/30">
                  {user._count.sentCollabs + user._count.receivedCollabs} collabs
                </Badge>
                <Badge variant="outline" className="text-[10px] border-white/10 text-white/30">
                  {user._count.referralsMade} filleuls
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 4 — Analytics */}
        <Link href="/analytics">
          <Card className="bg-white/[0.03] border-white/10 hover:border-blue-500/30 transition-all h-full group">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <ChartLine className="h-5 w-5 text-blue-400" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold">Analytics</h3>
              <p className="text-white/30 text-xs">Performance, revenus, engagement, croissance unifiée.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Badge variant="outline" className="text-[10px] border-blue-500/20 text-blue-400">
                  Temps réel
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Streaming */}
        <Link href="/streaming">
          <Card className="bg-white/[0.03] border-white/10 hover:border-red-500/30 transition-all h-full group">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Tv className="h-5 w-5 text-red-400" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-red-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold">Streaming</h3>
              <p className="text-white/30 text-xs">Netflix IA — soumettez et regardez les films de la communauté.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Badge variant="outline" className="text-[10px] border-white/10 text-white/30">
                  {user._count.catalogFilms} films soumis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Module 6 — Investissement */}
        <Link href="/tokenization">
          <Card className="bg-white/[0.03] border-white/10 hover:border-amber-500/30 transition-all h-full group">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-amber-400" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold">Investissement</h3>
              <p className="text-white/30 text-xs">Tokenization de films, dividendes, gouvernance, marché secondaire.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-400">
                  {totalTokensHeld} tokens
                </Badge>
                {pendingDividends > 0 && (
                  <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400">
                    {pendingDividends} dividende(s)
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Admin (admin only) */}
        {isAdmin && (
          <Link href="/admin">
            <Card className="bg-white/[0.03] border-white/10 hover:border-orange-500/30 transition-all h-full group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-orange-400" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-orange-400 transition-colors" />
                </div>
                <h3 className="text-white font-semibold">Administration</h3>
                <p className="text-white/30 text-xs">Gestion utilisateurs, catalogue, payouts, interventions.</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[#D4AF37]/5 to-transparent border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#D4AF37]" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Générer une vidéo', href: '/creator/generate', icon: Wand2, color: 'text-purple-400' },
              { label: 'Voir le planning', href: '/creator/schedule', icon: Calendar, color: 'text-blue-400' },
              { label: 'NoFace Studio', href: '/creator/noface', icon: EyeOff, color: 'text-cyan-400' },
              { label: 'Inviter un ami', href: '/collabs/referrals', icon: UserPlus, color: 'text-green-400' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all min-h-[44px]"
              >
                <action.icon className={`h-4 w-4 shrink-0 ${action.color}`} />
                <span className="text-white/70 text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions pour Activer la Plateforme */}
      {isAdmin && (
        <Card className="bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              Questions pour Activer la Plateforme
            </CardTitle>
            <p className="text-white/30 text-xs mt-1">
              Checklist des actions requises pour le lancement officiel de Lumière.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {([
                {
                  title: 'Créer une entité légale en Israel (Ltd)',
                  description: 'Enregistrer une société Ltd auprès du Companies Registrar. Nécessaire pour les contrats, paiements et conformité légale.',
                  icon: Building2,
                  helper: 'HUMAN',
                  needsAttention: true,
                  link: 'https://www.gov.il/en/departments/topics/companies-registrar',
                },
                {
                  title: 'Ouvrir un compte bancaire professionnel',
                  description: 'Compte multi-devises (EUR/USD/ILS) pour recevoir les paiements Stripe et verser les contributeurs.',
                  icon: Landmark,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Configurer Stripe Connect pour les paiements',
                  description: 'Activer Stripe Connect Custom pour les payouts aux créateurs, contributeurs et investisseurs.',
                  icon: CreditCard,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Obtenir les clés API (Claude, ElevenLabs, Runway)',
                  description: 'Clés API de production pour la revue IA, la génération vocale et la génération vidéo.',
                  icon: Key,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Souscrire à un KYC provider (Sumsub recommandé)',
                  description: 'Vérification identité obligatoire pour la tokenisation. Sumsub offre le meilleur rapport qualité/prix.',
                  icon: ShieldCheck,
                  helper: 'BOTH',
                  needsAttention: true,
                },
                {
                  title: 'Demander le sandbox ISA pour les tokens',
                  description: 'L\'Israel Securities Authority propose un sandbox réglementaire pour les security tokens. Dossier à soumettre.',
                  icon: Scale,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Enregistrer le nom de domaine et configurer Cloudflare',
                  description: 'Domaine lumiere.film avec DNS, SSL, protection DDoS et CDN via Cloudflare.',
                  icon: Globe,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
                {
                  title: 'Déployer sur Coolify/Hetzner',
                  description: 'Serveur VPS Hetzner + Coolify pour le déploiement automatisé. Base de données PostgreSQL + Redis.',
                  icon: Server,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
              ] as const).map((item) => (
                <div
                  key={item.title}
                  className={`p-4 rounded-lg border transition-all ${
                    item.needsAttention
                      ? 'bg-amber-500/[0.03] border-amber-500/20'
                      : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Square className={`h-4 w-4 ${item.needsAttention ? 'text-amber-400/50' : 'text-white/20'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <item.icon className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-amber-400' : 'text-white/40'}`} />
                        <h4 className="text-white text-sm font-medium">{item.title}</h4>
                      </div>
                      <p className="text-white/30 text-xs mt-1.5 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 h-4 ${
                            item.helper === 'CLAUDE'
                              ? 'border-purple-500/30 text-purple-400'
                              : item.helper === 'HUMAN'
                              ? 'border-orange-500/30 text-orange-400'
                              : 'border-blue-500/30 text-blue-400'
                          }`}
                        >
                          {item.helper === 'CLAUDE' ? 'Claude peut aider' : item.helper === 'HUMAN' ? 'Action humaine' : 'Les deux'}
                        </Badge>
                        {'link' in item && item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors"
                          >
                            Plus d&apos;info <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
