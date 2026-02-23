import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Users, Trophy, Film, Heart, Sparkles, ArrowRight,
  Crown, Clapperboard, PenTool, Vote, Timer, Star,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Communaute — Votez et Creez Ensemble',
  description:
    'Participez a la creation collective de films IA. Votez pour les meilleurs scenarios, bandes-annonces et propositions creatives.',
  openGraph: {
    title: 'Communaute — Votez et Creez Ensemble | Lumiere',
    description: 'Participez a la creation collective de films IA. Votez pour les meilleurs scenarios.',
  },
}

async function getCommunityStats() {
  try {
    const [totalVotes, totalScenarios, totalContests, totalEntries] = await Promise.all([
      prisma.scenarioVote.count().then((sv) =>
        prisma.trailerVote.count().then((tv) => sv + tv)
      ),
      prisma.scenarioProposal.count(),
      prisma.trailerContest.count({ where: { status: 'CLOSED' } }),
      prisma.trailerEntry.count(),
    ])
    return { totalVotes, totalScenarios, totalContests, totalEntries }
  } catch {
    return { totalVotes: 0, totalScenarios: 0, totalContests: 0, totalEntries: 0 }
  }
}

async function getActiveContests() {
  try {
    return await prisma.trailerContest.findMany({
      where: { status: { in: ['OPEN', 'VOTING'] } },
      include: {
        film: { select: { title: true, slug: true } },
        _count: { select: { entries: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    })
  } catch {
    return []
  }
}

async function getVotingScenarios() {
  try {
    return await prisma.scenarioProposal.findMany({
      where: { status: 'VOTING' },
      include: {
        author: { select: { displayName: true } },
      },
      orderBy: { votesCount: 'desc' },
      take: 5,
    })
  } catch {
    return []
  }
}

async function getRecentWinners() {
  try {
    const [scenarioWinners, contestWinners] = await Promise.all([
      prisma.scenarioProposal.findMany({
        where: { status: 'WINNER' },
        include: { author: { select: { displayName: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 3,
      }),
      prisma.trailerContest.findMany({
        where: { status: 'CLOSED', winnerId: { not: null } },
        include: {
          entries: {
            include: { user: { select: { displayName: true } } },
            orderBy: { votesCount: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 3,
      }),
    ])
    return { scenarioWinners, contestWinners }
  } catch {
    return { scenarioWinners: [], contestWinners: [] }
  }
}

const CONTEST_STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  UPCOMING: { label: 'A venir', variant: 'secondary' },
  OPEN: { label: 'Ouvert', variant: 'success' },
  VOTING: { label: 'En Vote', variant: 'default' },
  CLOSED: { label: 'Termine', variant: 'secondary' },
}

export default async function CommunityPage() {
  const [stats, contests, votingScenarios, winners] = await Promise.all([
    getCommunityStats(),
    getActiveContests(),
    getVotingScenarios(),
    getRecentWinners(),
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.03] via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 text-[#D4AF37]" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Communaute <span className="text-[#D4AF37]">Creative</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Le cinema se fait ensemble. Proposez des scenarios, votez pour vos favoris,
            participez aux concours de trailers. La communaute decide, le film se cree.
          </p>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 sm:mt-8">
            <Link
              href="/community/scenarios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.04] transition-all duration-200 min-h-[44px]"
            >
              <PenTool className="h-4 w-4" />
              Scenarios
            </Link>
            <Link
              href="/community/contests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-white text-sm font-semibold hover:bg-[#C4A030] transition-all duration-200 shadow-sm min-h-[44px]"
            >
              <Trophy className="h-4 w-4" />
              Concours
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.04] transition-all duration-200 min-h-[44px]"
            >
              <Crown className="h-4 w-4" />
              Classement
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 space-y-10 sm:space-y-16">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Votes exprimes', value: stats.totalVotes, icon: Heart, color: 'text-red-500' },
            { label: 'Scenarios proposes', value: stats.totalScenarios, icon: PenTool, color: 'text-blue-500' },
            { label: 'Concours termines', value: stats.totalContests, icon: Trophy, color: 'text-[#D4AF37]' },
            { label: 'Participations', value: stats.totalEntries, icon: Film, color: 'text-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Contests */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[#D4AF37]" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Concours Actifs
              </h2>
            </div>
            <Link
              href="/community/contests"
              className="text-sm text-[#D4AF37] hover:text-[#C4A030] transition-colors flex items-center gap-1"
            >
              Tous les concours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {contests.length === 0 ? (
            <Card className="border-gray-100 bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">Aucun concours actif pour le moment</p>
                <p className="text-xs text-gray-300 mt-1">Revenez bientot !</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {contests.map((contest) => {
                const statusInfo = CONTEST_STATUS_BADGE[contest.status] || CONTEST_STATUS_BADGE.UPCOMING
                const daysLeft = contest.endDate
                  ? Math.max(0, Math.ceil((new Date(contest.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : null

                return (
                  <Link key={contest.id} href={`/community/contests/${contest.id}`}>
                    <Card variant={contest.status === 'VOTING' ? 'gold' : 'default'} className="h-full group cursor-pointer border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          {daysLeft !== null && daysLeft <= 7 && (
                            <div className="flex items-center gap-1 text-xs text-orange-500">
                              <Timer className="h-3 w-3" />
                              {daysLeft === 0 ? 'Dernier jour !' : `${daysLeft}j restant${daysLeft > 1 ? 's' : ''}`}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                          {contest.title}
                        </h3>
                        {contest.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {contest.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {contest.film && (
                            <span className="flex items-center gap-1">
                              <Clapperboard className="h-3 w-3" />
                              {contest.film.title}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            {contest._count.entries} participation{contest._count.entries !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Scenarios in Vote */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Vote className="h-6 w-6 text-[#D4AF37]" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Scenarios en Vote
              </h2>
            </div>
            <Link
              href="/community/scenarios"
              className="text-sm text-[#D4AF37] hover:text-[#C4A030] transition-colors flex items-center gap-1"
            >
              Tous les scenarios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {votingScenarios.length === 0 ? (
            <Card className="border-gray-100 bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <PenTool className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">Aucun scenario en vote actuellement</p>
                <p className="text-xs text-gray-300 mt-1">Proposez le votre !</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {votingScenarios.map((scenario, idx) => (
                <Link key={scenario.id} href={`/community/scenarios/${scenario.id}`}>
                  <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 bg-white hover:border-[#D4AF37]/30 hover:shadow-sm transition-all duration-200 min-h-[56px] shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-sm font-bold text-[#D4AF37] shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#D4AF37] transition-colors truncate">
                        {scenario.title}
                      </h4>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {scenario.logline}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-400">{scenario.author.displayName}</span>
                        {scenario.genre && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-500 border-gray-200">{scenario.genre}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#D4AF37] shrink-0">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-bold tabular-nums">{scenario.votesCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Winners */}
        {(winners.scenarioWinners.length > 0 || winners.contestWinners.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-[#D4AF37]" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Palmares Recent
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {winners.scenarioWinners.map((w) => (
                <Link key={w.id} href={`/community/scenarios/${w.id}`}>
                  <Card variant="gold" className="h-full group cursor-pointer border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="h-4 w-4 text-[#D4AF37]" />
                        <Badge>Scenario Gagnant</Badge>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#D4AF37] transition-colors mb-1">
                        {w.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{w.logline}</p>
                      <p className="text-xs text-gray-400">par {w.author.displayName}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {winners.contestWinners.map((c) => {
                const winner = c.entries[0]
                return (
                  <Link key={c.id} href={`/community/contests/${c.id}`}>
                    <Card variant="gold" className="h-full group cursor-pointer border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy className="h-4 w-4 text-[#D4AF37]" />
                          <Badge>Concours Gagnant</Badge>
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#D4AF37] transition-colors mb-1">
                          {c.title}
                        </h4>
                        {winner && (
                          <p className="text-xs text-gray-400">
                            Gagnant : {winner.user.displayName} — {winner.title}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center p-6 sm:p-10 rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.04] to-white relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/[0.05] rounded-full blur-[60px] pointer-events-none" />
          <Sparkles className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            La communaute decide, le cinema se cree
          </h2>
          <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
            Chaque vote compte. Chaque idee peut devenir un film. Rejoignez la revolution du cinema collaboratif.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              href="/community/scenarios"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-white font-semibold hover:bg-[#C4A030] transition-all duration-200 shadow-sm min-h-[44px]"
            >
              <PenTool className="h-4 w-4" />
              Proposer un scenario
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/[0.06] transition-all duration-200 min-h-[44px]"
            >
              <Star className="h-4 w-4" />
              Rejoindre Lumiere
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
