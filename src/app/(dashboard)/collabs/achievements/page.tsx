import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ShareCard } from '@/components/ui/share-card'
import {
  Users, ShoppingBag, Share2, Megaphone, Trophy,
  Lock, Star, Sparkles, Award
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Accomplissements' }

// ============================
// Achievement definitions
// ============================

type AchievementDef = {
  id: string
  icon: string
  title: string
  description: string
  category: string
  categoryIcon: string
  threshold: number
  metricKey: string
}

const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // Contributeur
  { id: 'contrib_1', icon: '🎬', title: 'Premiere tache', description: 'Completez votre premiere tache', category: 'Contributeur', categoryIcon: '🎬', threshold: 1, metricKey: 'tasksCompleted' },
  { id: 'contrib_10', icon: '🎬', title: 'Contributeur Actif', description: 'Completez 10 taches', category: 'Contributeur', categoryIcon: '🎬', threshold: 10, metricKey: 'tasksCompleted' },
  { id: 'contrib_100', icon: '🎬', title: 'Centurion', description: 'Completez 100 taches — Vous etes une legende du studio', category: 'Contributeur', categoryIcon: '🎬', threshold: 100, metricKey: 'tasksCompleted' },

  // Createur
  { id: 'creator_1', icon: '🎥', title: 'Premiere video', description: 'Publiez votre premiere video IA', category: 'Createur', categoryIcon: '🎥', threshold: 1, metricKey: 'videosPublished' },
  { id: 'creator_viral', icon: '🎥', title: 'Viral', description: 'Atteignez 10 000 vues totales', category: 'Createur', categoryIcon: '🎥', threshold: 10000, metricKey: 'totalViews' },
  { id: 'creator_star', icon: '🎥', title: 'Star', description: 'Atteignez 100 000 vues totales', category: 'Createur', categoryIcon: '🎥', threshold: 100000, metricKey: 'totalViews' },

  // Collaborateur
  { id: 'collab_1', icon: '🤝', title: 'Premier collab', description: 'Completez votre premiere collaboration', category: 'Collaborateur', categoryIcon: '🤝', threshold: 1, metricKey: 'collabsCompleted' },
  { id: 'collab_10', icon: '🤝', title: 'Networker', description: 'Completez 10 collaborations', category: 'Collaborateur', categoryIcon: '🤝', threshold: 10, metricKey: 'collabsCompleted' },
  { id: 'collab_50', icon: '🤝', title: 'Influenceur', description: 'Completez 50 collaborations — Vous etes au coeur du reseau', category: 'Collaborateur', categoryIcon: '🤝', threshold: 50, metricKey: 'collabsCompleted' },

  // Parrain
  { id: 'ref_1', icon: '👥', title: 'Premier filleul', description: 'Parrainez votre premier utilisateur', category: 'Parrain', categoryIcon: '👥', threshold: 1, metricKey: 'referralsCompleted' },
  { id: 'ref_10', icon: '👥', title: 'Ambassadeur', description: 'Parrainez 10 utilisateurs', category: 'Parrain', categoryIcon: '👥', threshold: 10, metricKey: 'referralsCompleted' },
  { id: 'ref_50', icon: '👥', title: 'Legende', description: 'Parrainez 50 utilisateurs — Vous etes un pilier de la communaute', category: 'Parrain', categoryIcon: '👥', threshold: 50, metricKey: 'referralsCompleted' },

  // Reputation
  { id: 'rep_bronze', icon: '⭐', title: 'Bronze', description: 'Atteignez un score de reputation de 20+', category: 'Reputation', categoryIcon: '⭐', threshold: 20, metricKey: 'reputationScore' },
  { id: 'rep_silver', icon: '⭐', title: 'Argent', description: 'Atteignez un score de reputation de 40+', category: 'Reputation', categoryIcon: '⭐', threshold: 40, metricKey: 'reputationScore' },
  { id: 'rep_gold', icon: '⭐', title: 'Or', description: 'Atteignez un score de reputation de 65+', category: 'Reputation', categoryIcon: '⭐', threshold: 65, metricKey: 'reputationScore' },
  { id: 'rep_platinum', icon: '⭐', title: 'Platine', description: 'Atteignez un score de reputation de 85+ — L\'excellence absolue', category: 'Reputation', categoryIcon: '⭐', threshold: 85, metricKey: 'reputationScore' },
]

export default async function AchievementsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Fetch user metrics
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      tasksCompleted: true,
      points: true,
      reputationScore: true,
    },
  })

  if (!user) redirect('/login')

  // Videos published count
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  let videosPublished = 0
  let totalViews = 0
  if (profile) {
    videosPublished = await prisma.generatedVideo.count({
      where: { profileId: profile.id, status: 'PUBLISHED' },
    })
    const viewsAgg = await prisma.generatedVideo.aggregate({
      where: { profileId: profile.id },
      _sum: { viewCount: true },
    })
    totalViews = viewsAgg._sum.viewCount || 0
  }

  // Collabs completed
  const collabsCompleted = await prisma.collabRequest.count({
    where: {
      OR: [
        { fromUserId: session.user.id },
        { toUserId: session.user.id },
      ],
      status: 'COMPLETED',
    },
  })

  // Referrals completed
  const referralsCompleted = await prisma.referral.count({
    where: {
      referrerId: session.user.id,
      status: 'COMPLETED',
    },
  })

  // Build metrics map
  const metrics: Record<string, number> = {
    tasksCompleted: user.tasksCompleted,
    videosPublished,
    totalViews,
    collabsCompleted,
    referralsCompleted,
    reputationScore: user.reputationScore,
  }

  // Calculate achievement states
  const achievements = ACHIEVEMENT_DEFINITIONS.map((def) => {
    const currentValue = metrics[def.metricKey] || 0
    const progress = Math.min(100, Math.round((currentValue / def.threshold) * 100))
    const unlocked = currentValue >= def.threshold

    return {
      ...def,
      currentValue,
      progress,
      unlocked,
    }
  })

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalAchievements = achievements.length

  // Existing UserAchievements (synced from DB)
  const earnedAchievements = await prisma.userAchievement.findMany({
    where: { userId: session.user.id },
    select: { achievementType: true, earnedAt: true },
  })
  const earnedSet = new Set(earnedAchievements.map((a) => a.achievementType))

  // Group by category
  const categories = [...new Set(ACHIEVEMENT_DEFINITIONS.map((a) => a.category))]

  const navLinks = [
    { href: '/collabs', label: 'Marketplace', icon: Users, active: false },
    { href: '/collabs/orders', label: 'Commandes', icon: ShoppingBag, active: false },
    { href: '/collabs/referrals', label: 'Parrainage', icon: Share2, active: false },
    { href: '/collabs/achievements', label: 'Accomplissements', icon: Trophy, active: true },
    { href: '/collabs/outreach', label: 'Outreach', icon: Megaphone, active: false },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Vos Accomplissements
        </h1>
        <p className="text-white/40 mt-1">
          Debloquez des badges, progressez et montrez vos reussites a la communaute
        </p>
      </div>

      {/* Nav tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              link.active
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <link.icon className="h-4 w-4" /> {link.label}
          </Link>
        ))}
      </div>

      {/* Summary card */}
      <Card variant="gold">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center shrink-0">
              <Trophy className="h-10 w-10 text-black" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-white text-2xl font-bold mb-1">
                {unlockedCount} / {totalAchievements}
              </h2>
              <p className="text-white/50 text-sm mb-3">Accomplissements debloques</p>
              <Progress value={(unlockedCount / totalAchievements) * 100} className="h-3" />
            </div>
            <div className="text-center shrink-0">
              <div className="text-3xl font-bold text-[#D4AF37]">{user.points}</div>
              <p className="text-white/40 text-sm mt-1">Points XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement categories */}
      {categories.map((category) => {
        const catAchievements = achievements.filter((a) => a.category === category)
        const catIcon = catAchievements[0]?.categoryIcon || '🏆'

        return (
          <div key={category} className="space-y-3">
            <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-playfair)] flex items-center gap-2">
              <span className="text-xl">{catIcon}</span> {category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catAchievements.map((achievement) => {
                const isEarned = earnedSet.has(achievement.id)
                const isUnlocked = achievement.unlocked

                return (
                  <Card
                    key={achievement.id}
                    className={`transition-all ${
                      isUnlocked
                        ? 'border-[#D4AF37]/30 bg-[#D4AF37]/[0.04] shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                        : 'bg-white/[0.02] border-white/5 opacity-70'
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-2xl ${
                          isUnlocked
                            ? 'bg-[#D4AF37]/20 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                            : 'bg-white/5'
                        }`}>
                          {isUnlocked ? (
                            <span>{achievement.icon}</span>
                          ) : (
                            <Lock className="h-5 w-5 text-white/20" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm ${
                              isUnlocked ? 'text-white' : 'text-white/40'
                            }`}>
                              {achievement.title}
                            </h3>
                            {isUnlocked && (
                              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                            )}
                          </div>
                          <p className={`text-xs mb-3 ${
                            isUnlocked ? 'text-white/50' : 'text-white/25'
                          }`}>
                            {achievement.description}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className={isUnlocked ? 'text-[#D4AF37]' : 'text-white/30'}>
                                {achievement.currentValue.toLocaleString()} / {achievement.threshold.toLocaleString()}
                              </span>
                              <span className={isUnlocked ? 'text-[#D4AF37] font-semibold' : 'text-white/20'}>
                                {achievement.progress}%
                              </span>
                            </div>
                            <Progress
                              value={achievement.progress}
                              className="h-1.5"
                              indicatorClassName={
                                isUnlocked
                                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0D060]'
                                  : 'bg-white/20'
                              }
                            />
                          </div>

                          {/* Share button for unlocked */}
                          {isUnlocked && (
                            <div className="mt-3">
                              <ShareCard
                                title={`J'ai debloque "${achievement.title}" sur Lumiere Brothers !`}
                                description={achievement.description}
                                url="https://lumiere-brothers.film/collabs/achievements"
                                compact
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Motivation section */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 text-[#D4AF37]/40 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2 font-[family-name:var(--font-playfair)]">
            Continuez a progresser !
          </h3>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            Chaque tache completee, chaque collaboration et chaque parrainage vous rapproche de nouveaux accomplissements.
            Partagez vos reussites et inspirez la communaute !
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors"
            >
              <Star className="h-4 w-4" /> Faire des taches
            </Link>
            <Link
              href="/collabs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-colors border border-white/10"
            >
              <Users className="h-4 w-4" /> Collaborer
            </Link>
            <Link
              href="/collabs/referrals"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-colors border border-white/10"
            >
              <Share2 className="h-4 w-4" /> Parrainer
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
