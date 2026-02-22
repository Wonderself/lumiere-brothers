import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCreatorStats } from '@/app/actions/analytics'
import { LineChart } from '@/components/admin/charts/line-chart'
import { BarChart } from '@/components/admin/charts/bar-chart'
import { Sparkline } from '@/components/admin/charts/sparkline'
import Link from 'next/link'
import {
  Eye, Heart, Share2, Video, TrendingUp, ArrowLeft,
  Crown, BarChart3, Globe,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Performance Contenu' }

export default async function ContentAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const stats = await getCreatorStats(session.user.id)

  const totalViews = stats?.totalViews ?? 0
  const totalLikes = stats?.totalLikes ?? 0
  const totalShares = stats?.totalShares ?? 0
  const engagementRate = stats?.engagementRate ?? 0
  const videos = stats?.videos ?? []
  const platformBreakdown = stats?.platformBreakdown ?? []

  // Sort videos by views for "best performing"
  const topVideos = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)
  const isTopVideo = (id: string) => topVideos.length > 0 && topVideos[0].id === id

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/analytics" className="text-xs text-white/40 hover:text-[#D4AF37] flex items-center gap-1 mb-3">
          <ArrowLeft className="h-3 w-3" /> Retour Analytics
        </Link>
        <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
          Performance Contenu
        </h1>
        <p className="text-white/50">Analyse detaillee de vos videos et publications</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'Total Vues', value: totalViews.toLocaleString('fr-FR'), color: '#D4AF37', sparkline: stats?.viewsTrend?.map(v => v.value) ?? [] },
          { icon: Heart, label: 'Total Likes', value: totalLikes.toLocaleString('fr-FR'), color: '#ef4444', sparkline: stats?.likesTrend?.map(v => v.value) ?? [] },
          { icon: Share2, label: 'Total Partages', value: totalShares.toLocaleString('fr-FR'), color: '#3b82f6', sparkline: [] },
          { icon: TrendingUp, label: 'Engagement', value: `${engagementRate}%`, color: '#a855f7', sparkline: stats?.engagementTrend?.map(v => v.value) ?? [] },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
              {kpi.sparkline.length > 0 && <Sparkline data={kpi.sparkline} color={kpi.color} />}
            </div>
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Views Trend Chart */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-white/80 mb-4">Evolution des Vues</h2>
        {stats?.viewsTrend && stats.viewsTrend.length > 0 ? (
          <LineChart data={stats.viewsTrend} color="#D4AF37" height={220} />
        ) : (
          <div className="text-white/30 text-sm text-center py-16">
            <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
            Publiez des videos pour voir l&apos;evolution
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/80">Repartition par Plateforme</h2>
          </div>
          {platformBreakdown.length > 0 ? (
            <BarChart
              data={platformBreakdown.map(p => ({
                label: p.platform,
                value: p.views,
                color: p.platform === 'YOUTUBE' ? '#ff0000'
                  : p.platform === 'TIKTOK' ? '#00f2ea'
                  : p.platform === 'INSTAGRAM' ? '#e1306c'
                  : p.platform === 'X' ? '#1da1f2'
                  : p.platform === 'FACEBOOK' ? '#4267B2'
                  : '#D4AF37',
              }))}
              height={200}
            />
          ) : (
            <div className="text-white/30 text-sm text-center py-12">Aucune plateforme connectee</div>
          )}
          {platformBreakdown.length > 0 && (
            <div className="mt-4 space-y-2">
              {platformBreakdown.map((p) => (
                <div key={p.platform} className="flex items-center justify-between text-xs">
                  <span className="text-white/50">{p.platform}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-white/60">{p.count} videos</span>
                    <span className="text-white/60">{p.likes} likes</span>
                    <span className="text-white/60">{p.shares} partages</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Performing */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-white/80">Meilleures Performances</h2>
          </div>
          {topVideos.length > 0 ? (
            <div className="space-y-3">
              {topVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    index === 0
                      ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
                      : 'border-white/5 bg-white/[0.01]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    index === 0 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/50'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {video.viewCount.toLocaleString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {video.likeCount.toLocaleString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" /> {video.shareCount.toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  {video.viewCount > 0 && (
                    <div className="text-right shrink-0">
                      <div className="text-xs font-medium text-[#D4AF37]">
                        {((video.likeCount + video.shareCount) / video.viewCount * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-white/30">engagement</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/30 text-sm text-center py-12">Aucune video publiee</div>
          )}
        </div>
      </div>

      {/* Full Video Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white/80">Toutes les Videos</h2>
          <span className="text-xs text-white/30 ml-auto">{videos.length} videos</span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucune video pour le moment</p>
            <p className="text-xs mt-1">Creez du contenu pour voir vos performances ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-medium p-4">Video</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Vues</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Likes</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Partages</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Engagement</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Plateformes</th>
                  <th className="text-right text-xs text-white/40 font-medium p-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => {
                  const engagement = video.viewCount > 0
                    ? ((video.likeCount + video.shareCount) / video.viewCount * 100).toFixed(1)
                    : '0.0'
                  return (
                    <tr key={video.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${isTopVideo(video.id) ? 'bg-[#D4AF37]/5' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {isTopVideo(video.id) && <Crown className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />}
                          <div>
                            <p className="text-sm font-medium truncate max-w-[240px]">{video.title}</p>
                            {video.duration && (
                              <span className="text-[10px] text-white/30">{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm font-medium text-white/80">{video.viewCount.toLocaleString('fr-FR')}</td>
                      <td className="p-4 text-right text-sm text-white/60">{video.likeCount.toLocaleString('fr-FR')}</td>
                      <td className="p-4 text-right text-sm text-white/60">{video.shareCount.toLocaleString('fr-FR')}</td>
                      <td className="p-4 text-right">
                        <span className={`text-sm font-medium ${parseFloat(engagement) >= 5 ? 'text-green-400' : parseFloat(engagement) >= 2 ? 'text-yellow-400' : 'text-white/50'}`}>
                          {engagement}%
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {video.platforms.map((p) => (
                            <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          video.status === 'PUBLISHED' ? 'border-green-500/30 bg-green-500/10 text-green-400'
                          : 'border-white/10 bg-white/5 text-white/40'
                        }`}>
                          {video.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
