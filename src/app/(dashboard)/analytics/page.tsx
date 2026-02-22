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
  ChevronRight,
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
      label: 'Total Vues',
      value: totalViews.toLocaleString('fr-FR'),
      trend: totalViews > 0 ? '+12%' : '--',
      trendUp: true,
      sparkline: creatorStats?.viewsTrend?.map(v => v.value) ?? [0, 0, 0, 0, 0],
      color: '#D4AF37',
      href: '/analytics/content',
    },
    {
      icon: DollarSign,
      label: 'Revenus Totaux',
      value: `${totalRevenue.toFixed(2)} EUR`,
      trend: revenueStats?.projection ? `+${Math.round(((revenueStats.projection - (revenueStats.monthlyData.slice(-1)[0]?.total ?? 0)) / Math.max(revenueStats.monthlyData.slice(-1)[0]?.total ?? 1, 1)) * 100)}%` : '--',
      trendUp: true,
      sparkline: revenueStats?.monthlyData?.map(m => m.total) ?? [0, 0, 0, 0, 0],
      color: '#22c55e',
      href: '/analytics/revenue',
    },
    {
      icon: TrendingUp,
      label: 'Taux Engagement',
      value: `${engagementRate}%`,
      trend: engagementRate > 5 ? 'Excellent' : engagementRate > 2 ? 'Bon' : 'A ameliorer',
      trendUp: engagementRate > 2,
      sparkline: creatorStats?.engagementTrend?.map(v => v.value) ?? [0, 0, 0, 0, 0],
      color: '#a855f7',
      href: '/analytics/content',
    },
    {
      icon: Users,
      label: 'Abonnes',
      value: totalFollowers.toLocaleString('fr-FR'),
      trend: totalFollowers > 0 ? '+8%' : '--',
      trendUp: true,
      sparkline: [Math.round(totalFollowers * 0.7), Math.round(totalFollowers * 0.75), Math.round(totalFollowers * 0.82), Math.round(totalFollowers * 0.9), totalFollowers],
      color: '#3b82f6',
      href: '/analytics/collabs',
    },
    {
      icon: Handshake,
      label: 'Taux Collabs',
      value: `${successRate}%`,
      trend: `${collabStats?.completed ?? 0} terminees`,
      trendUp: successRate > 50,
      sparkline: [0, collabStats?.rejected ?? 0, collabStats?.pending ?? 0, collabStats?.completed ?? 0],
      color: '#f59e0b',
      href: '/analytics/collabs',
    },
    {
      icon: Wallet,
      label: 'Solde Lumens',
      value: lumenBalance.toLocaleString('fr-FR'),
      trend: `${revenueStats?.totalTokensEarned ?? 0} gagnes`,
      trendUp: lumenBalance > 0,
      sparkline: revenueStats?.monthlyData?.map(m => m.tokens) ?? [0, 0, 0, 0, 0],
      color: '#06b6d4',
      href: '/analytics/revenue',
    },
  ]

  // Period selector labels
  const periods: { key: PeriodKey; label: string }[] = [
    { key: '7d', label: '7 jours' },
    { key: '30d', label: '30 jours' },
    { key: '90d', label: '90 jours' },
    { key: '1y', label: '1 an' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
            Analytics
          </h1>
          <p className="text-white/50 text-sm sm:text-base">Vue unifiee de vos performances</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 self-start overflow-x-auto">
          {periods.map((p) => (
            <Link
              key={p.key}
              href={`/analytics?period=${p.key}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                period === p.key
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#D4AF37]/20 transition-all cursor-pointer h-full">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
                <Sparkline data={kpi.sparkline} color={kpi.color} />
              </div>
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/40">{kpi.label}</span>
                <span className={`text-xs flex items-center gap-0.5 ${kpi.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.trend}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Views Trend Chart */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">Evolution des Vues</h2>
            <Link href="/analytics/content" className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1">
              Details <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {creatorStats?.viewsTrend && creatorStats.viewsTrend.length > 0 ? (
            <LineChart data={creatorStats.viewsTrend} color="#D4AF37" height={200} />
          ) : (
            <div className="text-white/30 text-sm text-center py-16">
              <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Publiez des videos pour voir vos stats
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">Evolution des Revenus</h2>
            <Link href="/analytics/revenue" className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1">
              Details <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {revenueStats?.monthlyData && revenueStats.monthlyData.length > 0 ? (
            <AreaChart
              data={revenueStats.monthlyData.map(m => ({ label: m.label, value: m.total }))}
              color="#22c55e"
              height={200}
            />
          ) : (
            <div className="text-white/30 text-sm text-center py-16">
              <Wallet className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Aucun revenu pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Sources Donut */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Revenus par Source</h2>
          {revenueStats?.revenueBySource && revenueStats.revenueBySource.some(s => s.value > 0) ? (
            <DonutChart data={revenueStats.revenueBySource.filter(s => s.value > 0)} size={160} />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">Pas de donnees</div>
          )}
        </div>

        {/* Engagement Trend */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Tendance Engagement</h2>
          {creatorStats?.engagementTrend && creatorStats.engagementTrend.length > 0 ? (
            <LineChart data={creatorStats.engagementTrend} color="#a855f7" height={180} />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">Pas de donnees</div>
          )}
        </div>

        {/* Collab Summary */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">Collaborations</h2>
            <Link href="/analytics/collabs" className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1">
              Voir <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Total</span>
              <span className="text-lg font-bold text-white">{collabStats?.totalCollabs ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Terminees</span>
              <span className="text-lg font-bold text-green-400">{collabStats?.completed ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">En cours</span>
              <span className="text-lg font-bold text-yellow-400">{collabStats?.pending ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Taux Succes</span>
              <span className="text-lg font-bold text-[#D4AF37]">{collabStats?.successRate ?? 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Note Moyenne</span>
              <span className="text-lg font-bold text-purple-400">{collabStats?.avgRating ?? 0}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: Video, label: 'Performance Contenu', description: 'Videos, vues, engagement par plateforme', href: '/analytics/content' },
          { icon: Handshake, label: 'Collaborations', description: 'Taux de succes, ROI, partenaires', href: '/analytics/collabs' },
          { icon: BarChart3, label: 'Revenus', description: 'Sources, transactions, projections', href: '/analytics/revenue' },
        ].map((nav) => (
          <Link key={nav.href} href={nav.href}>
            <div className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 hover:border-[#D4AF37]/20 transition-all">
              <nav.icon className="h-6 w-6 text-[#D4AF37] mb-3" />
              <h3 className="font-semibold text-sm mb-1">{nav.label}</h3>
              <p className="text-xs text-white/40">{nav.description}</p>
              <div className="mt-3 text-xs text-[#D4AF37] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explorer <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
