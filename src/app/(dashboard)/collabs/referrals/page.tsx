import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ShareCard } from '@/components/ui/share-card'
import { REFERRAL_BONUS } from '@/lib/tokens'
import {
  Share2, Users, Coins, Gift, Copy, TrendingUp,
  CheckCircle2, Clock, ShoppingBag, Megaphone, UserPlus,
  Trophy, Zap, ArrowRight, Target, Calculator, Crown,
  Sparkles
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Parrainage' }

export default async function ReferralsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      referralCode: true,
      lumenBalance: true,
      displayName: true,
    },
  })

  if (!user) redirect('/login')

  // Generate referral code if missing
  let referralCode = user.referralCode
  if (!referralCode) {
    referralCode = `LUM-${session.user.id.slice(0, 8).toUpperCase()}`
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode },
    })
  }

  // Fetch referrals made by this user
  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: {
      referred: {
        select: {
          id: true,
          displayName: true,
          email: true,
          createdAt: true,
          isVerified: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Stats
  const totalReferrals = referrals.length
  const completedReferrals = referrals.filter((r) => r.status === 'COMPLETED').length
  const pendingReferrals = referrals.filter((r) => r.status === 'PENDING').length
  const totalTokensEarned = referrals.reduce((sum, r) => sum + r.tokensEarned, 0)
  const conversionRate = totalReferrals > 0
    ? Math.round((completedReferrals / totalReferrals) * 100)
    : 0

  const referralLink = `https://lumiere-brothers.film/register?ref=${referralCode}`

  // Monthly challenge: referrals this month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const referralsThisMonth = referrals.filter(
    (r) => r.createdAt >= monthStart
  ).length
  const monthlyChallenge = 5
  const challengeProgress = Math.min(100, Math.round((referralsThisMonth / monthlyChallenge) * 100))
  const challengeComplete = referralsThisMonth >= monthlyChallenge

  // Top referrers leaderboard (top 5 this month)
  const topReferrers = await prisma.referral.groupBy({
    by: ['referrerId'],
    where: {
      createdAt: { gte: monthStart },
    },
    _count: { id: true },
    _sum: { tokensEarned: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5,
  })

  // Fetch user details for top referrers
  const topReferrerIds = topReferrers.map((r) => r.referrerId)
  const topReferrerUsers = await prisma.user.findMany({
    where: { id: { in: topReferrerIds } },
    select: { id: true, displayName: true, email: true },
  })
  const userMap = new Map(topReferrerUsers.map((u) => [u.id, u]))

  const leaderboard = topReferrers.map((entry, index) => {
    const u = userMap.get(entry.referrerId)
    return {
      rank: index + 1,
      name: u?.displayName || u?.email || 'Utilisateur',
      referrals: entry._count.id,
      tokens: entry._sum.tokensEarned || 0,
      isCurrentUser: entry.referrerId === session.user.id,
    }
  })

  // Earnings calculator estimates
  const estimatedEarnings = [
    { friends: 5, tokens: 5 * REFERRAL_BONUS.referrer, value: (5 * REFERRAL_BONUS.referrer * 0.10).toFixed(0) },
    { friends: 10, tokens: 10 * REFERRAL_BONUS.referrer, value: (10 * REFERRAL_BONUS.referrer * 0.10).toFixed(0) },
    { friends: 25, tokens: 25 * REFERRAL_BONUS.referrer, value: (25 * REFERRAL_BONUS.referrer * 0.10).toFixed(0) },
    { friends: 50, tokens: 50 * REFERRAL_BONUS.referrer, value: (50 * REFERRAL_BONUS.referrer * 0.10).toFixed(0) },
  ]

  const navLinks = [
    { href: '/collabs', label: 'Marketplace', icon: Users, active: false },
    { href: '/collabs/orders', label: 'Commandes', icon: ShoppingBag, active: false },
    { href: '/collabs/referrals', label: 'Parrainage', icon: Share2, active: true },
    { href: '/collabs/achievements', label: 'Accomplissements', icon: Trophy, active: false },
    { href: '/collabs/outreach', label: 'Outreach', icon: Megaphone, active: false },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Programme de Parrainage
        </h1>
        <p className="text-white/40 mt-1 text-sm sm:text-base">
          Invitez des createurs et gagnez des tokens ensemble
        </p>
      </div>

      {/* Nav tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[44px] ${
              link.active
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <link.icon className="h-4 w-4" /> {link.label}
          </Link>
        ))}
      </div>

      {/* Bonus info */}
      <Card variant="gold">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <Gift className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-lg font-semibold mb-2">
                +{REFERRAL_BONUS.referrer} tokens pour vous, +{REFERRAL_BONUS.referred} tokens pour votre filleul
              </h2>
              <p className="text-white/50 text-sm">
                Chaque filleul qui s&apos;inscrit et complete son profil vous rapporte {REFERRAL_BONUS.referrer} tokens.
                Votre filleul recoit egalement {REFERRAL_BONUS.referred} tokens de bienvenue.
                Bonus: {REFERRAL_BONUS.recurringPct}% de commission sur les achats de tokens de vos filleuls.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* Monthly Challenge */}
      {/* ========================================== */}
      <Card className={`border ${challengeComplete ? 'border-green-500/30 bg-green-500/[0.04]' : 'border-[#D4AF37]/20 bg-[#D4AF37]/[0.03]'}`}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${
              challengeComplete
                ? 'bg-green-500/20'
                : 'bg-[#D4AF37]/20'
            }`}>
              {challengeComplete ? (
                <CheckCircle2 className="h-7 w-7 text-green-400" />
              ) : (
                <Target className="h-7 w-7 text-[#D4AF37]" />
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold">Challenge du mois</h3>
                {challengeComplete && (
                  <Badge variant="success">Complete !</Badge>
                )}
              </div>
              <p className="text-white/50 text-sm mb-3">
                {challengeComplete
                  ? 'Bravo ! Vous avez releve le defi ce mois-ci ! Bonus de 100 tokens credites.'
                  : `Invitez ${monthlyChallenge} amis ce mois-ci et recevez un bonus de 100 tokens supplementaires !`
                }
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">{referralsThisMonth} / {monthlyChallenge} parrainages</span>
                  <span className={challengeComplete ? 'text-green-400 font-semibold' : 'text-[#D4AF37]'}>
                    {challengeProgress}%
                  </span>
                </div>
                <Progress
                  value={challengeProgress}
                  className="h-2"
                  indicatorClassName={
                    challengeComplete
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : undefined
                  }
                />
              </div>
            </div>
            <div className="text-center shrink-0 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <Zap className="h-5 w-5 text-[#D4AF37] mx-auto mb-1" />
              <span className="text-xl font-bold text-white">100</span>
              <p className="text-white/30 text-[10px] uppercase">bonus tokens</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* Prominent Social Sharing Section */}
      {/* ========================================== */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#D4AF37]" />
            Partagez et invitez
          </CardTitle>
          <CardDescription>Utilisez des messages pre-ecrits pour maximiser vos conversions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Code de parrainage</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 flex items-center">
                <span className="text-[#D4AF37] font-mono font-bold tracking-wider">{referralCode}</span>
              </div>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Lien partageable</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 rounded-lg border border-white/10 bg-white/5 px-4 flex items-center overflow-hidden">
                <span className="text-white/70 text-sm truncate">{referralLink}</span>
              </div>
            </div>
          </div>

          {/* Share buttons with pre-written messages */}
          <div className="pt-2">
            <label className="block text-white/50 text-xs mb-3">Partager avec un message pre-ecrit</label>
            <ShareCard
              title="Rejoignez-moi sur Lumiere Brothers !"
              description={`Je cree des films IA sur Lumiere Brothers. Inscrivez-vous avec mon lien et recevez ${REFERRAL_BONUS.referred} tokens gratuits !`}
              url={referralLink}
            />
          </div>

          {/* Pre-written social posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
              <p className="text-white/30 text-[10px] uppercase font-semibold mb-2 tracking-wider">Message Twitter / X</p>
              <p className="text-white/60 text-sm italic leading-relaxed">
                &quot;Je cree des films avec l&apos;IA sur @LumiereBrothers ! 🎬 C&apos;est le futur du cinema collaboratif. Rejoignez-moi et recevez 30 tokens gratuits pour commencer 👇&quot;
              </p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
              <p className="text-white/30 text-[10px] uppercase font-semibold mb-2 tracking-wider">Message WhatsApp / SMS</p>
              <p className="text-white/60 text-sm italic leading-relaxed">
                &quot;Salut ! Je participe a un projet de films generes par IA, c&apos;est incroyable. Tu peux creer des videos, contribuer au montage, et gagner de l&apos;argent. Inscris-toi ici :&quot;
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total parraines', value: totalReferrals, icon: Users, color: 'text-blue-400' },
          { label: 'Tokens gagnes', value: totalTokensEarned, icon: Coins, color: 'text-[#D4AF37]' },
          { label: 'Taux conversion', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'En attente', value: pendingReferrals, icon: Clock, color: 'text-orange-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========================================== */}
      {/* Viral Loop Visualization */}
      {/* ========================================== */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            Boucle virale — Gagnez a chaque niveau
          </CardTitle>
          <CardDescription>Vos filleuls invitent aussi, et vous gagnez a chaque etape</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 py-4">
            {/* Level 1 - You */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]/40 flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-sm">VOUS</span>
              </div>
              <p className="text-white/50 text-xs mt-2 text-center">Votre profil</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2 sm:px-4">
              <ArrowRight className="h-5 w-5 text-[#D4AF37]/40 hidden sm:block" />
              <div className="h-5 w-px bg-[#D4AF37]/40 sm:hidden" />
              <p className="text-[#D4AF37] text-[10px] font-semibold mt-1">+{REFERRAL_BONUS.referrer} tokens</p>
            </div>

            {/* Level 2 - Friend */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-white/50 text-xs mt-2 text-center">Votre Ami</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2 sm:px-4">
              <ArrowRight className="h-5 w-5 text-blue-400/40 hidden sm:block" />
              <div className="h-5 w-px bg-blue-400/40 sm:hidden" />
              <p className="text-blue-400 text-[10px] font-semibold mt-1">+{REFERRAL_BONUS.recurringPct}% commission</p>
            </div>

            {/* Level 3 - Friend of friend */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-purple-500/20 border-2 border-purple-500/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-white/50 text-xs mt-2 text-center">Ami de l&apos;ami</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2 sm:px-4">
              <ArrowRight className="h-5 w-5 text-purple-400/40 hidden sm:block" />
              <div className="h-5 w-px bg-purple-400/40 sm:hidden" />
              <p className="text-purple-400 text-[10px] font-semibold mt-1">tokens a chaque niveau</p>
            </div>

            {/* Level 4 - Infinity */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center">
                <span className="text-white/40 text-2xl">...</span>
              </div>
              <p className="text-white/30 text-xs mt-2 text-center">Et ainsi de suite</p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-[#D4AF37]/[0.04] border border-[#D4AF37]/15 text-center">
            <p className="text-white/60 text-sm">
              Chaque utilisateur que vous invitez peut lui-meme parrainer d&apos;autres personnes.
              <br />
              <span className="text-[#D4AF37] font-semibold">
                Vous gagnez {REFERRAL_BONUS.recurringPct}% de commission sur chaque achat de tokens de vos filleuls directs.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* Earnings Calculator */}
      {/* ========================================== */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#D4AF37]" />
            Estimez vos gains
          </CardTitle>
          <CardDescription>Decouvrez combien vous pouvez gagner grace au parrainage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {estimatedEarnings.map((est) => (
              <div
                key={est.friends}
                className="rounded-lg bg-white/[0.03] border border-white/5 p-4 text-center hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.02] transition-all"
              >
                <p className="text-white/40 text-xs mb-2">Si vous invitez</p>
                <p className="text-2xl font-bold text-white mb-1">{est.friends}</p>
                <p className="text-white/40 text-xs mb-3">amis</p>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-[#D4AF37] font-bold text-lg">{est.tokens}</p>
                  <p className="text-white/30 text-[10px] uppercase">tokens bonus directs</p>
                  <p className="text-green-400/80 text-xs mt-1">+ ~{est.value}EUR/mois en commissions</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs text-center mt-3">
            * Estimation basee sur une depense moyenne de 10EUR/mois par filleul avec {REFERRAL_BONUS.recurringPct}% de commission
          </p>
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* Monthly Leaderboard */}
      {/* ========================================== */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#D4AF37]" />
            Top Parrains du mois
          </CardTitle>
          <CardDescription>Les 5 meilleurs parrains de {now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-10 w-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">Aucun parrainage ce mois-ci</p>
              <p className="text-white/20 text-sm mt-1">Soyez le premier a apparaitre ici !</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-[#D4AF37]/[0.06] border border-[#D4AF37]/15'
                      : 'bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Rank */}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    entry.rank === 1 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                    entry.rank === 2 ? 'bg-gray-300/10 text-gray-300' :
                    entry.rank === 3 ? 'bg-orange-400/10 text-orange-400' :
                    'bg-white/5 text-white/30'
                  }`}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      entry.isCurrentUser ? 'text-[#D4AF37]' : 'text-white'
                    }`}>
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="text-white/30 text-xs ml-2">(vous)</span>
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">{entry.referrals}</p>
                      <p className="text-white/30 text-[10px] hidden sm:block">parrainages</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D4AF37] text-sm font-semibold">{entry.tokens}</p>
                      <p className="text-white/30 text-[10px] hidden sm:block">tokens</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral list */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#D4AF37]" />
            Vos filleuls ({totalReferrals})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-lg">Aucun filleul pour le moment</p>
              <p className="text-white/20 text-sm mt-1">
                Partagez votre lien pour commencer a parrainer
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                      {(referral.referred.displayName || referral.referred.email || 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {referral.referred.displayName || referral.referred.email}
                      </p>
                      <p className="text-white/30 text-xs">
                        Inscrit le {referral.referred.createdAt.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {referral.tokensEarned > 0 && (
                      <span className="text-[#D4AF37] text-sm font-medium">
                        +{referral.tokensEarned} tokens
                      </span>
                    )}
                    <Badge
                      variant={
                        referral.status === 'COMPLETED' ? 'success' :
                        referral.status === 'EXPIRED' ? 'destructive' : 'warning'
                      }
                    >
                      {referral.status === 'COMPLETED' ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Complete
                        </span>
                      ) : referral.status === 'EXPIRED' ? 'Expire' : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> En attente
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle>Comment ca marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Partagez votre lien',
                desc: 'Envoyez votre lien de parrainage a vos contacts et sur vos reseaux.',
                icon: Share2,
              },
              {
                step: '2',
                title: 'Inscription du filleul',
                desc: `Le filleul s'inscrit et recoit ${REFERRAL_BONUS.referred} tokens de bienvenue.`,
                icon: UserPlus,
              },
              {
                step: '3',
                title: 'Bonus credites',
                desc: `Vous recevez ${REFERRAL_BONUS.referrer} tokens + ${REFERRAL_BONUS.recurringPct}% de commission continue.`,
                icon: Gift,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-12 w-12 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <p className="text-white font-semibold mb-1">{item.title}</p>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
