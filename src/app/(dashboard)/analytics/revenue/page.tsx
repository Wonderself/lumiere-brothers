import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getRevenueStats } from '@/app/actions/analytics'
import { LineChart } from '@/components/admin/charts/line-chart'
import { AreaChart } from '@/components/admin/charts/area-chart'
import { DonutChart } from '@/components/admin/charts/donut-chart'
import { BarChart } from '@/components/admin/charts/bar-chart'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  ArrowLeft, DollarSign, Wallet, TrendingUp, Gift,
  ArrowUpRight, ArrowDownRight, CreditCard, Film,
  Users, Zap, Clock,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Revenus' }

export default async function RevenueAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const stats = await getRevenueStats(session.user.id)

  const totalRevenueEur = stats?.totalRevenueEur ?? 0
  const taskRevenue = stats?.taskRevenue ?? 0
  const streamingRevenue = stats?.streamingRevenue ?? 0
  const referralTokens = stats?.referralTokens ?? 0
  const totalTokensEarned = stats?.totalTokensEarned ?? 0
  const lumenSpent = stats?.lumenSpent ?? 0
  const lumenBalance = stats?.lumenBalance ?? 0
  const transactions = stats?.transactions ?? []
  const payments = stats?.payments ?? []
  const payouts = stats?.payouts ?? []
  const monthlyData = stats?.monthlyData ?? []
  const projection = stats?.projection ?? 0
  const revenueBySource = stats?.revenueBySource ?? []

  // Monthly revenue for LineChart
  const monthlyChartData = monthlyData.map(m => ({
    label: m.label,
    value: m.total,
  }))

  // Monthly tokens for AreaChart
  const monthlyTokensData = monthlyData.map(m => ({
    label: m.label,
    value: m.tokens,
  }))

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/analytics" className="text-xs text-white/40 hover:text-[#D4AF37] flex items-center gap-1 mb-3">
          <ArrowLeft className="h-3 w-3" /> Retour Analytics
        </Link>
        <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
          Revenus
        </h1>
        <p className="text-white/50">Suivi complet de vos revenus et transactions</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Revenu Total', value: formatPrice(totalRevenueEur), color: '#22c55e' },
          { icon: CreditCard, label: 'Taches', value: formatPrice(taskRevenue), color: '#D4AF37' },
          { icon: Film, label: 'Streaming', value: formatPrice(streamingRevenue), color: '#3b82f6' },
          { icon: Wallet, label: 'Solde Lumens', value: `${lumenBalance.toLocaleString('fr-FR')} LMN`, color: '#06b6d4' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <kpi.icon className="h-5 w-5 mb-3" style={{ color: kpi.color }} />
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue by Source & Monthly Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Revenus par Source</h2>
          {revenueBySource.some(s => s.value > 0) ? (
            <DonutChart data={revenueBySource.filter(s => s.value > 0)} size={180} />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">
              <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Aucun revenu enregistre
            </div>
          )}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Revenus Mensuels (EUR)</h2>
          {monthlyChartData.length > 0 ? (
            <LineChart data={monthlyChartData} color="#22c55e" height={200} />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">Pas de donnees mensuelles</div>
          )}
        </div>
      </div>

      {/* Tokens Chart & Projection */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Token Flow */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Flux de Tokens</h2>
          <BarChart
            data={[
              { label: 'Gagnes', value: totalTokensEarned, color: '#22c55e' },
              { label: 'Depenses', value: lumenSpent, color: '#ef4444' },
              { label: 'Solde', value: Math.max(lumenBalance, 0), color: '#D4AF37' },
            ]}
            height={160}
          />
        </div>

        {/* Tokens Over Time */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Tokens Mensuels</h2>
          {monthlyTokensData.length > 0 ? (
            <AreaChart data={monthlyTokensData} color="#06b6d4" height={160} />
          ) : (
            <div className="text-white/30 text-sm text-center py-8">Pas de donnees</div>
          )}
        </div>

        {/* Projection */}
        <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">
          <h2 className="text-sm font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projection
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-white/40 mb-1">Prochain mois (estime)</div>
              <div className="text-3xl font-bold text-[#D4AF37]">{formatPrice(projection)}</div>
              {monthlyData.length > 0 && (
                <div className="text-xs text-green-400 flex items-center gap-0.5 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +10% vs moyenne recente
                </div>
              )}
            </div>
            <div className="border-t border-[#D4AF37]/20 pt-4">
              <div className="text-xs text-white/40 mb-1">Projection annuelle</div>
              <div className="text-xl font-bold text-white">{formatPrice(projection * 12)}</div>
              <div className="text-[10px] text-white/30 mt-1">Base sur la tendance actuelle</div>
            </div>
            <div className="border-t border-[#D4AF37]/20 pt-4">
              <div className="text-xs text-white/40 mb-1">Referrals</div>
              <div className="text-lg font-bold text-blue-400">{referralTokens} LMN</div>
              <div className="text-[10px] text-white/30 mt-1">gagnes en parrainages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Transactions History */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <Zap className="h-4 w-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white/80">Transactions Tokens</h2>
          <span className="text-xs text-white/30 ml-auto">{transactions.length} transactions</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucune transaction</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium p-4">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium p-4">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium p-4">Description</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 30).map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-white/30" />
                        {formatDate(tx.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        tx.type === 'TASK_REWARD' ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : tx.type === 'PURCHASE' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        : tx.type === 'BONUS' || tx.type === 'REFERRAL_BONUS' || tx.type === 'STREAK_BONUS' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                        : tx.type === 'SPENT' || tx.type === 'VIDEO_GEN' || tx.type === 'PUBLISH' ? 'border-red-500/30 bg-red-500/10 text-red-400'
                        : 'border-white/10 bg-white/5 text-white/40'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/60 truncate max-w-[300px]">
                      {tx.description || '--'}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-sm font-medium ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount >= 0 ? '+' : ''}{tx.amount} LMN
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payments from Tasks & Creator Payouts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Payments */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/80">Paiements Taches</h2>
            <span className="text-xs text-white/30 ml-auto">{payments.length}</span>
          </div>
          {payments.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">Aucun paiement</div>
          ) : (
            <div className="divide-y divide-white/5">
              {payments.slice(0, 10).map((payment) => (
                <div key={payment.id} className="flex items-center gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{payment.task.title}</p>
                    <p className="text-[10px] text-white/30">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className="text-sm font-bold text-green-400">{formatPrice(payment.amountEur)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creator Payouts */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <Film className="h-4 w-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/80">Revenus Streaming</h2>
            <span className="text-xs text-white/30 ml-auto">{payouts.length}</span>
          </div>
          {payouts.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">Aucun revenu streaming</div>
          ) : (
            <div className="divide-y divide-white/5">
              {payouts.slice(0, 10).map((payout) => (
                <div key={payout.id} className="flex items-center gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{payout.film?.title || 'Film'}</p>
                    <p className="text-[10px] text-white/30">{payout.month} — {payout.totalViews} vues</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-blue-400">{formatPrice(payout.amountEur)}</span>
                    <div className="text-[10px] text-white/30">
                      <span className={`${
                        payout.status === 'PAID' ? 'text-green-400'
                        : payout.status === 'CALCULATED' ? 'text-yellow-400'
                        : 'text-white/30'
                      }`}>
                        {payout.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
