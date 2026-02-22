import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/admin/charts/line-chart'
import { BarChart } from '@/components/admin/charts/bar-chart'
import { DonutChart } from '@/components/admin/charts/donut-chart'
import { AreaChart } from '@/components/admin/charts/area-chart'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Analytics' }

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [tasksByType, tasksByDifficulty, usersByLevel, payments, submissions] = await Promise.all([
    prisma.task.groupBy({ by: ['type'], _count: true }),
    prisma.task.groupBy({ by: ['difficulty'], _count: true }),
    prisma.user.groupBy({ by: ['level'], _count: true }),
    prisma.payment.findMany({
      where: { status: 'COMPLETED' },
      select: { amountEur: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.taskSubmission.findMany({
      select: { createdAt: true, status: true, aiScore: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Revenue over time (group by month)
  const revenueByMonth = new Map<string, number>()
  payments.forEach(p => {
    const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`
    revenueByMonth.set(key, (revenueByMonth.get(key) || 0) + p.amountEur)
  })
  const revenueData = [...revenueByMonth.entries()].map(([label, value]) => ({ label, value: Math.round(value) }))

  // Submissions over time
  const subsByMonth = new Map<string, number>()
  submissions.forEach(s => {
    const key = `${s.createdAt.getFullYear()}-${String(s.createdAt.getMonth() + 1).padStart(2, '0')}`
    subsByMonth.set(key, (subsByMonth.get(key) || 0) + 1)
  })
  const subsData = [...subsByMonth.entries()].map(([label, value]) => ({ label, value }))

  // Task type labels
  const typeLabels: Record<string, string> = {
    PROMPT: 'Prompt IA', IMAGE_GEN: 'Image', VIDEO_GEN: 'Vidéo', AUDIO_GEN: 'Audio',
    VOICE_CLONE: 'Voice', SUBTITLE: 'Sous-titres', REVIEW: 'Review', STORYBOARD: 'Storyboard',
    SCRIPT_EDIT: 'Script', COLOR_GRADE: 'Étalonnage', MUSIC_COMPOSE: 'Musique', SOUND_DESIGN: 'Sound Design',
  }

  const difficultyColors: Record<string, string> = {
    EASY: '#22c55e', MEDIUM: '#D4AF37', HARD: '#f97316', EXPERT: '#ef4444',
  }
  const levelColors: Record<string, string> = {
    ROOKIE: '#9ca3af', PRO: '#3b82f6', EXPERT: '#D4AF37', VIP: '#a855f7',
  }

  // Success rate by difficulty
  const successByDifficulty = await prisma.task.groupBy({
    by: ['difficulty'],
    where: { status: 'VALIDATED' },
    _count: true,
  })
  const totalByDifficulty = await prisma.task.groupBy({
    by: ['difficulty'],
    _count: true,
  })

  const successRateData = totalByDifficulty.map(t => {
    const validated = successByDifficulty.find(s => s.difficulty === t.difficulty)?._count || 0
    return {
      label: t.difficulty,
      value: t._count > 0 ? Math.round((validated / t._count) * 100) : 0,
      color: difficultyColors[t.difficulty] || '#D4AF37',
    }
  })

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Analytics</h1>
        <p className="text-white/50">Données et tendances de la plateforme</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Revenus dans le temps</CardTitle></CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <LineChart data={revenueData} color="#D4AF37" />
            ) : (
              <p className="text-sm text-white/30 text-center py-8">Pas encore de revenus</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Soumissions dans le temps</CardTitle></CardHeader>
          <CardContent>
            {subsData.length > 0 ? (
              <AreaChart data={subsData} color="#22c55e" />
            ) : (
              <p className="text-sm text-white/30 text-center py-8">Pas encore de soumissions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Tâches par type</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={tasksByType.map(t => ({
              label: typeLabels[t.type] || t.type,
              value: t._count,
            }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Distribution des niveaux</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={usersByLevel.map(u => ({
              label: u.level,
              value: u._count,
              color: levelColors[u.level] || '#9ca3af',
            }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Taux de succès par difficulté</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={successRateData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Tâches par difficulté</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={tasksByDifficulty.map(t => ({
              label: t.difficulty,
              value: t._count,
              color: difficultyColors[t.difficulty] || '#D4AF37',
            }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
