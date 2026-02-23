import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wand2, Video, Calendar, TrendingUp, Eye, Heart, Share2, Clapperboard } from 'lucide-react'

export default async function CreatorDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      videos: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  // If no profile, redirect to wizard
  if (!profile || !profile.wizardCompleted) {
    redirect('/creator/wizard')
  }

  const totalVideos = await prisma.generatedVideo.count({ where: { profileId: profile.id } })
  const publishedVideos = await prisma.generatedVideo.count({ where: { profileId: profile.id, status: 'PUBLISHED' } })
  const totalViews = await prisma.generatedVideo.aggregate({ where: { profileId: profile.id }, _sum: { viewCount: true } })
  const totalLikes = await prisma.generatedVideo.aggregate({ where: { profileId: profile.id }, _sum: { likeCount: true } })

  const stats = [
    { label: 'Vidéos', value: totalVideos, icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Publiées', value: publishedVideos, icon: Clapperboard, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Vues totales', value: totalViews._sum.viewCount || 0, icon: Eye, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
    { label: 'Likes', value: totalLikes._sum.likeCount || 0, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Studio Créateur
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Bienvenue, <span className="text-[#D4AF37] font-medium">{profile.stageName}</span> — Mode {profile.automationLevel.toLowerCase()}
          </p>
        </div>
        <Link
          href="/creator/generate"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#C5A028] transition-colors min-h-[44px]"
        >
          <Wand2 className="h-4 w-4" /> Nouvelle Vidéo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</span>
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { href: '/creator/generate', label: 'Générer une vidéo', desc: 'IA créé tout pour vous', icon: Wand2, bg: 'bg-amber-50', border: 'border-amber-100' },
          { href: '/creator/schedule', label: 'Planifier', desc: 'Calendrier de publication', icon: Calendar, bg: 'bg-blue-50', border: 'border-blue-100' },
          { href: '/analytics', label: 'Performance', desc: 'Stats détaillées', icon: TrendingUp, bg: 'bg-green-50', border: 'border-green-100' },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <div className={`${action.bg} ${action.border} border rounded-2xl hover:shadow-md transition-all cursor-pointer p-5 flex items-center gap-4`}>
              <action.icon className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-gray-900 font-semibold">{action.label}</p>
                <p className="text-gray-500 text-sm">{action.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-6 pb-4">
          <h2 className="text-gray-900 font-bold text-lg font-[family-name:var(--font-playfair)]">Vidéos récentes</h2>
          <Link href="/creator/videos" className="text-[#D4AF37] text-sm hover:underline shrink-0">Voir tout &rarr;</Link>
        </div>
        <div className="px-6 pb-6">
          {profile.videos.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Aucune vidéo encore</p>
              <Link href="/creator/generate" className="text-[#D4AF37] text-sm hover:underline mt-2 inline-block">
                Créer votre première vidéo &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.videos.map((video) => (
                <Link key={video.id} href={`/creator/videos/${video.id}`} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]">
                  <div className="h-12 w-16 sm:w-20 rounded bg-gray-100 shrink-0 flex items-center justify-center">
                    <Video className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">{video.title}</p>
                    <p className="text-gray-400 text-xs">{video.createdAt.toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 ${
                    video.status === 'PUBLISHED' ? 'border-green-200 text-green-600' :
                    video.status === 'GENERATING' ? 'border-yellow-200 text-yellow-600' :
                    video.status === 'READY' ? 'border-blue-200 text-blue-600' :
                    'border-gray-200 text-gray-500'
                  }`}>
                    {video.status === 'PUBLISHED' ? 'Publiée' :
                     video.status === 'GENERATING' ? 'En cours...' :
                     video.status === 'READY' ? 'Prête' :
                     video.status === 'DRAFT' ? 'Brouillon' : video.status}
                  </Badge>
                  <div className="text-right text-xs text-gray-400 hidden sm:block">
                    <p className="flex items-center gap-1"><Eye className="h-3 w-3" /> {video.viewCount}</p>
                    <p className="flex items-center gap-1"><Heart className="h-3 w-3" /> {video.likeCount}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Clapperboard className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-gray-900 font-medium">{profile.stageName}</p>
            <p className="text-gray-500 text-sm">
              {profile.niche || 'Niche non définie'} &middot; Style {profile.style.toLowerCase()}
            </p>
          </div>
        </div>
        <Link href="/creator/wizard" className="text-[#D4AF37] text-sm hover:underline">Modifier &rarr;</Link>
      </div>
    </div>
  )
}
