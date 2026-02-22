import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCollabStats } from '@/app/actions/analytics'
import { DonutChart } from '@/components/admin/charts/donut-chart'
import { BarChart } from '@/components/admin/charts/bar-chart'
import Link from 'next/link'
import {
  Handshake, ArrowLeft, CheckCircle, Clock, XCircle,
  Star, Users, TrendingUp, Zap, ShieldCheck,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Collaborations' }

export default async function CollabAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const stats = await getCollabStats(session.user.id)

  const totalCollabs = stats?.totalCollabs ?? 0
  const completed = stats?.completed ?? 0
  const pending = stats?.pending ?? 0
  const rejected = stats?.rejected ?? 0
  const successRate = stats?.successRate ?? 0
  const avgRating = stats?.avgRating ?? 0
  const typeBreakdown = stats?.typeBreakdown ?? []
  const totalFollowers = stats?.totalFollowers ?? 0
  const avgEngagement = stats?.avgEngagement ?? 0
  const totalEscrowSpent = stats?.totalEscrowSpent ?? 0
  const sentCollabs = stats?.sentCollabs ?? []
  const receivedCollabs = stats?.receivedCollabs ?? []
  const orders = stats?.orders ?? []
  const ordersCompleted = stats?.ordersCompleted ?? 0
  const ordersDisputed = stats?.ordersDisputed ?? 0

  // Collab status distribution for DonutChart
  const statusDistribution = [
    { label: 'Terminees', value: completed, color: '#22c55e' },
    { label: 'En cours', value: pending, color: '#f59e0b' },
    { label: 'Rejetees', value: rejected, color: '#ef4444' },
  ].filter(s => s.value > 0)

  // Type breakdown for BarChart
  const typeBarData = typeBreakdown.map(t => ({
    label: t.type === 'SHOUTOUT' ? 'Shoutout'
      : t.type === 'CO_CREATE' ? 'Co-Creation'
      : t.type === 'GUEST' ? 'Guest'
      : t.type === 'AD_EXCHANGE' ? 'Ad Exchange'
      : t.type,
    value: t.total,
    color: t.type === 'CO_CREATE' ? '#D4AF37'
      : t.type === 'SHOUTOUT' ? '#3b82f6'
      : t.type === 'GUEST' ? '#a855f7'
      : '#22c55e',
  }))

  // Estimated ROI per collab (followers gained per collab)
  const followersPerCollab = completed > 0 ? Math.round(totalFollowers / completed) : 0
  const engagementBoost = completed > 0 ? (avgEngagement * completed * 0.1).toFixed(1) : '0'

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/analytics" className="text-xs text-white/40 hover:text-[#D4AF37] flex items-center gap-1 mb-3">
          <ArrowLeft className="h-3 w-3" /> Retour Analytics
        </Link>
        <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
          Collaborations
        </h1>
        <p className="text-white/50">Statistiques et ROI de vos collaborations</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Handshake, label: 'Total Collabs', value: totalCollabs, color: '#D4AF37' },
          { icon: CheckCircle, label: 'Taux Succes', value: `${successRate}%`, color: '#22c55e' },
          { icon: Star, label: 'Note Moyenne', value: avgRating > 0 ? `${avgRating}/5` : '--', color: '#f59e0b' },
          { icon: Users, label: 'Abonnes Gagnes', value: totalFollowers.toLocaleString('fr-FR'), color: '#3b82f6' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <kpi.icon className="h-5 w-5 mb-3" style={{ color: kpi.color }} />
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Distribution des Collabs</h2>
          {statusDistribution.length > 0 ? (
            <DonutChart data={statusDistribution} size={180} />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">
              <Handshake className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Aucune collaboration
            </div>
          )}
        </div>

        {/* Type Breakdown */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/80 mb-4">Par Type de Collab</h2>
          {typeBarData.length > 0 ? (
            <BarChart data={typeBarData} height={200} />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">Pas de donnees</div>
          )}
        </div>
      </div>

      {/* ROI Section */}
      <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">
        <h2 className="text-sm font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          ROI des Collaborations
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg bg-black/20 p-4">
            <div className="text-xs text-white/40 mb-1">Abonnes / Collab</div>
            <div className="text-xl font-bold text-white">{followersPerCollab}</div>
            <div className="text-[10px] text-green-400 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="h-3 w-3" /> estimation moyenne
            </div>
          </div>
          <div className="rounded-lg bg-black/20 p-4">
            <div className="text-xs text-white/40 mb-1">Boost Engagement</div>
            <div className="text-xl font-bold text-white">+{engagementBoost}%</div>
            <div className="text-[10px] text-green-400 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="h-3 w-3" /> post-collab
            </div>
          </div>
          <div className="rounded-lg bg-black/20 p-4">
            <div className="text-xs text-white/40 mb-1">Tokens Investis</div>
            <div className="text-xl font-bold text-white">{totalEscrowSpent.toLocaleString('fr-FR')}</div>
            <div className="text-[10px] text-white/30 mt-1">en escrow total</div>
          </div>
          <div className="rounded-lg bg-black/20 p-4">
            <div className="text-xs text-white/40 mb-1">Commandes Video</div>
            <div className="text-xl font-bold text-white">{ordersCompleted}/{orders.length}</div>
            <div className="text-[10px] text-white/30 mt-1">
              {ordersDisputed > 0 && <span className="text-red-400">{ordersDisputed} dispute{ordersDisputed > 1 ? 's' : ''}</span>}
              {ordersDisputed === 0 && 'terminees'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Collabs Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sent Collabs */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/80">Collabs Envoyees</h2>
            <span className="text-xs text-white/30">{sentCollabs.length}</span>
          </div>
          {sentCollabs.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">Aucune collab envoyee</div>
          ) : (
            <div className="divide-y divide-white/5">
              {sentCollabs.slice(0, 10).map((collab) => (
                <div key={collab.id} className="flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    collab.status === 'COMPLETED' ? 'bg-green-400'
                    : collab.status === 'IN_PROGRESS' || collab.status === 'ACCEPTED' ? 'bg-yellow-400'
                    : collab.status === 'PENDING' ? 'bg-blue-400'
                    : 'bg-red-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {collab.toUser.displayName || 'Utilisateur'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/30">
                      <span>{collab.type}</span>
                      {collab.rating && (
                        <span className="flex items-center gap-0.5 text-yellow-400">
                          <Star className="h-2.5 w-2.5" /> {collab.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    collab.status === 'COMPLETED' ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : collab.status === 'PENDING' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : collab.status === 'IN_PROGRESS' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                  }`}>
                    {collab.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received Collabs */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/80">Collabs Recues</h2>
            <span className="text-xs text-white/30">{receivedCollabs.length}</span>
          </div>
          {receivedCollabs.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">Aucune collab recue</div>
          ) : (
            <div className="divide-y divide-white/5">
              {receivedCollabs.slice(0, 10).map((collab) => (
                <div key={collab.id} className="flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    collab.status === 'COMPLETED' ? 'bg-green-400'
                    : collab.status === 'IN_PROGRESS' || collab.status === 'ACCEPTED' ? 'bg-yellow-400'
                    : collab.status === 'PENDING' ? 'bg-blue-400'
                    : 'bg-red-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {collab.fromUser.displayName || 'Utilisateur'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/30">
                      <span>{collab.type}</span>
                      {collab.escrowTokens > 0 && (
                        <span className="text-[#D4AF37]">{collab.escrowTokens} tokens</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    collab.status === 'COMPLETED' ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : collab.status === 'PENDING' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : collab.status === 'IN_PROGRESS' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                  }`}>
                    {collab.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Orders */}
      {orders.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <Zap className="h-4 w-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/80">Commandes Video</h2>
            <span className="text-xs text-white/30 ml-auto">{orders.length} commandes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium p-4">Titre</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Prix</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Revisions</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium truncate max-w-[300px]">{order.title}</p>
                      <p className="text-[10px] text-white/30">{order.style || 'Standard'}</p>
                    </td>
                    <td className="p-4 text-right text-sm text-[#D4AF37] font-medium">
                      {order.priceTokens} LMN
                    </td>
                    <td className="p-4 text-right text-sm text-white/60">
                      {order.revisionCount}/{order.maxRevisions}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        order.status === 'COMPLETED' ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : order.status === 'DISPUTED' ? 'border-red-500/30 bg-red-500/10 text-red-400'
                        : order.status === 'IN_PROGRESS' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                        : 'border-white/10 bg-white/5 text-white/40'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
