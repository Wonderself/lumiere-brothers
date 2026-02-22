import { prisma } from '@/lib/prisma'
import { Trophy, Star, Medal, Crown, Zap, Film } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Classement — Lumière',
  description: 'Les meilleurs contributeurs de la plateforme Lumière.',
}

async function getLeaderboard() {
  try {
    return await prisma.user.findMany({
      where: { isVerified: true },
      select: {
        id: true,
        displayName: true,
        level: true,
        points: true,
        tasksCompleted: true,
        tasksValidated: true,
        role: true,
      },
      orderBy: [{ points: 'desc' }, { tasksCompleted: 'desc' }],
      take: 50,
    })
  } catch {
    return []
  }
}

async function getStats() {
  try {
    const [totalUsers, totalTasks, totalPaid] = await Promise.all([
      prisma.user.count({ where: { isVerified: true } }),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.payment.aggregate({
        _sum: { amountEur: true },
        where: { status: 'COMPLETED' },
      }),
    ])
    return { totalUsers, totalTasks, totalPaid: totalPaid._sum.amountEur || 0 }
  } catch {
    return { totalUsers: 0, totalTasks: 0, totalPaid: 0 }
  }
}

const RANK_ICONS = [
  <Crown key={1} className="h-6 w-6 text-[#D4AF37]" />,
  <Medal key={2} className="h-6 w-6 text-gray-300" />,
  <Medal key={3} className="h-6 w-6 text-amber-600" />,
]

const LEVEL_COLORS: Record<string, string> = {
  ROOKIE: 'text-gray-400',
  PRO: 'text-blue-400',
  EXPERT: 'text-[#D4AF37]',
  VIP: 'text-purple-400',
}

const LEVEL_LABELS: Record<string, string> = {
  ROOKIE: 'Rookie',
  PRO: 'Pro',
  EXPERT: 'Expert',
  VIP: 'VIP',
}

export default async function LeaderboardPage() {
  const [users, stats] = await Promise.all([getLeaderboard(), getStats()])

  const top3 = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-[#D4AF37]" />
            <h1 className="text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Classement
            </h1>
          </div>
          <p className="text-white/50 text-lg">Les meilleurs contributeurs de la plateforme</p>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { label: 'Contributeurs actifs', value: stats.totalUsers, icon: <Star className="h-5 w-5 text-[#D4AF37]" /> },
            { label: 'Tâches validées', value: stats.totalTasks, icon: <Zap className="h-5 w-5 text-green-400" /> },
            { label: 'Revenus distribués', value: formatPrice(stats.totalPaid), icon: <Film className="h-5 w-5 text-purple-400" /> },
          ].map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {users.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">Aucun classement disponible</p>
            <p className="text-sm mt-2">Soyez le premier à contribuer !</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-12 items-end">
                {/* 2nd place */}
                {top3[1] ? (
                  <div className="flex flex-col items-center p-6 rounded-2xl border border-gray-500/20 bg-gray-500/5 mt-8">
                    <div className="mb-3">{RANK_ICONS[1]}</div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-500/20 to-gray-700/20 flex items-center justify-center text-xl font-bold text-white mb-2">
                      {top3[1].displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <p className="font-semibold text-sm truncate w-full text-center mb-1">
                      {top3[1].displayName}
                    </p>
                    <span className={`text-xs font-medium mb-2 ${LEVEL_COLORS[top3[1].level]}`}>
                      {LEVEL_LABELS[top3[1].level]}
                    </span>
                    <p className="text-lg font-bold text-white">{top3[1].points.toLocaleString()}</p>
                    <p className="text-xs text-white/30">points</p>
                  </div>
                ) : <div />}

                {/* 1st place */}
                <div className="flex flex-col items-center p-6 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                  <div className="mb-3">{RANK_ICONS[0]}</div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-amber-700/20 flex items-center justify-center text-2xl font-bold text-[#D4AF37] mb-2 ring-2 ring-[#D4AF37]/30">
                    {top3[0].displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <p className="font-semibold text-sm truncate w-full text-center mb-1">
                    {top3[0].displayName}
                  </p>
                  <span className={`text-xs font-medium mb-2 ${LEVEL_COLORS[top3[0].level]}`}>
                    {LEVEL_LABELS[top3[0].level]}
                  </span>
                  <p className="text-2xl font-bold text-[#D4AF37]">{top3[0].points.toLocaleString()}</p>
                  <p className="text-xs text-white/30">points</p>
                </div>

                {/* 3rd place */}
                {top3[2] ? (
                  <div className="flex flex-col items-center p-6 rounded-2xl border border-amber-600/20 bg-amber-600/5 mt-16">
                    <div className="mb-3">{RANK_ICONS[2]}</div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-800/20 flex items-center justify-center text-xl font-bold text-white mb-2">
                      {top3[2].displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <p className="font-semibold text-sm truncate w-full text-center mb-1">
                      {top3[2].displayName}
                    </p>
                    <span className={`text-xs font-medium mb-2 ${LEVEL_COLORS[top3[2].level]}`}>
                      {LEVEL_LABELS[top3[2].level]}
                    </span>
                    <p className="text-lg font-bold text-white">{top3[2].points.toLocaleString()}</p>
                    <p className="text-xs text-white/30">points</p>
                  </div>
                ) : <div />}
              </div>
            )}

            {/* Rest of ranking */}
            {rest.length > 0 && (
              <div className="space-y-2">
                {rest.map((user, idx) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all"
                  >
                    <div className="w-8 text-center text-sm font-bold text-white/30 shrink-0">
                      #{idx + 4}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {user.displayName?.[0]?.toUpperCase() || '?'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm truncate">{user.displayName}</p>
                        <span className={`text-xs ${LEVEL_COLORS[user.level]}`}>
                          {LEVEL_LABELS[user.level]}
                        </span>
                      </div>
                      <p className="text-xs text-white/30">
                        {user.tasksCompleted} tâche{user.tasksCompleted > 1 ? 's' : ''} validée{user.tasksCompleted > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-white">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/30">points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Rejoignez le classement
          </h2>
          <p className="text-white/50 mb-6 text-sm">
            Complétez des tâches, gagnez des points, progressez dans les niveaux.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-black font-semibold hover:bg-[#F0D060] transition-colors"
          >
            <Star className="h-4 w-4" />
            Commencer à contribuer
          </a>
        </div>
      </div>
    </div>
  )
}
