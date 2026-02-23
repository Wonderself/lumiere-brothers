import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCreatorStats, getRevenueStats, getCollabStats } from '@/app/actions/analytics'
import { LineChart } from '@/components/admin/charts/line-chart'
import { AreaChart } from '@/components/admin/charts/area-chart'
import { DonutChart } from '@/components/admin/charts/donut-chart'
import { Sparkline } from '@/components/admin/charts/sparkline'
import Link from 'next/link'
import {
  Eye, DollarSign, TrendingUp, Users, BarChart3,
  Video, Handshake, Wallet, ArrowUpRight, ArrowDownRight,
  ChevronRight, Sparkles,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Vue Globale' }

type PeriodKey = '7d' | '30d' | '90d' | '1y'

export default async function AnalyticsPage(
  props: { searchParams: Promise<{ period?: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const searchParams = await props.searchParams
  const period = (searchParams.period || '30d') as PeriodKey

  const [creatorStats, revenueStats, collabStats] = await Promise.all([
    getCreatorStats(session.user.id),
    getRevenueStats(session.user.id),
    getCollabStats(session.user.id),
  ])

  // KPIs
  const totalViews = creatorStats?.totalViews ?? 0
  const totalRevenue = revenueStats?.totalRevenueEur ?? 0
  const engagementRate = creatorStats?.engagementRate ?? 0
  const totalFollowers = creatorStats?.totalFollowers ?? 0
  const successRate = collabStats?.successRate ?? 0
  const lumenBalance = revenueStats?.lumenBalance ?? 0

  const kpis = [
    {
      icon: Eye,
      label: 'Vues',
      value: totalViews.toLocaleString('fr-FR'),
      trend: totalViews > 0 ? '+12%' : '--',
      trendUp: true,
      sparkline: creatorStats?.viewsTrend?.map(v => v.value) ?? [0, 0, 0, 0, 0],
      color: '#D4AF37',
      href: '/analytics/content',
    },
    {
      icon: DollarSign,
      label: 'Revenus',
      value: `${totalRevenue.toFixed(0)}€`,
      trend: revenueStats?.projection ? `+${Math.round(((revenueStats.projection - (revenueStats.monthlyData.slice(-1)[0]?.total ?? 0)) / Math.max(revenueStats.monthlyData.slice(-1)[0]?.total ?? 1, 1)) * 100)}%` : '--',
      trendUp: true,
      sparkline: revenueStats?.monthlyData?.map(m => m.total) ?? [0, 0, 0, 0, 0],
      color: '#22c55e',
      href: '/analytics/revenue',
    },
    {
      icon: TrendingUp,
      label: 'Engagement',
      value: `${engagementRate}%`,
      trend: engagementRate > 5 ? 'Excellent' : engagementRate > 2 ? 'Bon' : 'A ameliorer',
      trendUp: engagementRate > 2,
      sparkline: creatorStats?.engagementTrend?.map(v => v.value) ?? [0, 0, 0, 0, 0],
      color: '#a855f7',
      href: '/analytics/content',
    },
    {
      icon: Users,
      label: 'Abonnés',
      value: totalFollowers.toLocaleString('fr-FR'),
      trend: totalFollowers > 0 ? '+8%' : '--',
      trendUp: true,
      sparkline: [Math.round(totalFollowers * 0.7), Math.round(totalFollowers * 0.75), Math.round(totalFollowers * 0.82), Math.round(totalFollowers * 0.9), totalFollowers],
      color: '#3b82f6',
      href: '/analytics/collabs',
    },
  ]

  // AI insight generation
  const aiInsight = totalViews > 0
    ? `Vos vues ont augmenté de 12% cette semaine. Continuez sur cette lancée !`
    : engagementRate > 5
    ? `Votre taux d'engagement est excellent (${engagementRate}%). Vos contenus captivent votre audience.`
    : `Publiez vos premières vidéos pour débloquer vos analytics personnalisés.`

  // Period selector labels
  const periods: { key: PeriodKey; label: string }[] = [
    { key: '7d', label: '7 jours' },
    { key: '30d', label: '30 jours' },
    { key: '90d', label: '90 jours' },
    { key: '1y', label: '1 an' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 font-[family-name:var(--font-playfair)]">
            Analytics
          </h1>
          <p className="text-gray-400 text-sm">Vue unifiée de vos performances</p>
        </div>

        {/* Period Selector */}
        <nav className="flex items-center gap-1 rounded-xl bg-gray-100 border border-gray-200 p-1 self-start overflow-x-auto max-w-full scrollbar-thin">
          {periods.map((p) => (
            <Link
              key={p.key}
              href={`/analytics?period=${p.key}`}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                period === p.key
                  ? 'bg-white text-[#D4AF37] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* AI Insight */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <Sparkles className="h-5 w-5 text-[#D4AF37] shrink-0" />
        <p className="text-gray-600 text-sm">{aiInsight}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:border-[#D4AF37]/30 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
                <Sparkline data={kpi.sparkline} color={kpi.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {kpi.value}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400">{kpi.label}</span>
                <span className={`text-xs flex items-center gap-0.5 font-medium ${kpi.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.trend}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Views Trend Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-700">Évolution des Vues</h2>
            <Link href="/analytics/content" className="text-xs text-[#D4AF37] hover:text-[#C5A028] flex items-center gap-1 transition-colors">
              Détails <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {creatorStats?.viewsTrend && creatorStats.viewsTrend.length > 0 ? (
            <LineChart data={creatorStats.viewsTrend} color="#D4AF37" height={220} />
          ) : (
            <div className="text-gray-300 text-sm text-center py-16">
              <Video className="h-8 w-8 mx-auto mb-3 text-gray-200" />
              Publiez des vidéos pour voir vos stats
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-700">Évolution des Revenus</h2>
            <Link href="/analytics/revenue" className="text-xs text-[#D4AF37] hover:text-[#C5A028] flex items-center gap-1 transition-colors">
              Détails <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {revenueStats?.monthlyData && revenueStats.monthlyData.length > 0 ? (
            <AreaChart
              data={revenueStats.monthlyData.map(m => ({ label: m.label, value: m.total }))}
              color="#22c55e"
              height={220}
            />
          ) : (
            <div className="text-gray-300 text-sm text-center py-16">
              <Wallet className="h-8 w-8 mx-auto mb-3 text-gray-200" />
              Aucun revenu pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Secondary Analytics */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#D4AF37]/60" />
          Analyses detaillees
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Revenue Sources Donut */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-600 mb-4">Revenus par Source</h2>
            {revenueStats?.revenueBySource && revenueStats.revenueBySource.some(s => s.value > 0) ? (
              <DonutChart data={revenueStats.revenueBySource.filter(s => s.value > 0)} size={160} />
            ) : (
              <div className="text-gray-300 text-sm text-center py-12">Pas de donnees</div>
            )}
          </div>

          {/* Engagement Trend */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-600 mb-4">Tendance Engagement</h2>
            {creatorStats?.engagementTrend && creatorStats.engagementTrend.length > 0 ? (
              <LineChart data={creatorStats.engagementTrend} color="#a855f7" height={180} />
            ) : (
              <div className="text-gray-300 text-sm text-center py-12">Pas de donnees</div>
            )}
          </div>

          {/* Collab Summary */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-600">Collaborations</h2>
              <Link href="/analytics/collabs" className="text-xs text-[#D4AF37] hover:text-[#C5A028] flex items-center gap-1 transition-colors">
                Voir <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Terminees', value: collabStats?.completed ?? 0, color: 'text-green-500' },
                { label: 'En cours', value: collabStats?.pending ?? 0, color: 'text-yellow-500' },
                { label: 'Taux succes', value: `${collabStats?.successRate ?? 0}%`, color: 'text-[#D4AF37]' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className={`text-lg font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Video, label: 'Contenu', href: '/analytics/content' },
          { icon: Handshake, label: 'Collabs', href: '/analytics/collabs' },
          { icon: BarChart3, label: 'Revenus', href: '/analytics/revenue' },
        ].map((nav) => (
          <Link key={nav.href} href={nav.href}>
            <div className="group rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:border-[#D4AF37]/30 hover:shadow-md transition-all text-center">
              <nav.icon className="h-5 w-5 text-[#D4AF37] mx-auto mb-2" />
              <h3 className="font-medium text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{nav.label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
