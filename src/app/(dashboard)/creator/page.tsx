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
    { label: 'Vidéos', value: totalVideos, icon: Video, color: 'text-blue-400' },
    { label: 'Publiées', value: publishedVideos, icon: Clapperboard, color: 'text-green-400' },
    { label: 'Vues totales', value: totalViews._sum.viewCount || 0, icon: Eye, color: 'text-[#D4AF37]' },
    { label: 'Likes', value: totalLikes._sum.likeCount || 0, icon: Heart, color: 'text-red-400' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Studio Créateur
          </h1>
          <p className="text-white/40 mt-1 text-sm sm:text-base">
            Bienvenue, <span className="text-[#D4AF37]">{profile.stageName}</span> — Mode {profile.automationLevel.toLowerCase()}
          </p>
        </div>
        <Link
          href="/creator/generate"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors min-h-[44px]"
        >
          <Wand2 className="h-4 w-4" /> Nouvelle Vidéo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</span>
              </div>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { href: '/creator/generate', label: 'Générer une vidéo', desc: 'IA créé tout pour vous', icon: Wand2, color: 'bg-[#D4AF37]/10 border-[#D4AF37]/20' },
          { href: '/creator/schedule', label: 'Planifier', desc: 'Calendrier de publication', icon: Calendar, color: 'bg-blue-500/10 border-blue-500/20' },
          { href: '/analytics', label: 'Performance', desc: 'Stats détaillées', icon: TrendingUp, color: 'bg-green-500/10 border-green-500/20' },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className={`${action.color} hover:bg-white/[0.05] transition-colors cursor-pointer`}>
              <CardContent className="p-5 flex items-center gap-4">
                <action.icon className="h-8 w-8 text-white/60" />
                <div>
                  <p className="text-white font-semibold">{action.label}</p>
                  <p className="text-white/40 text-sm">{action.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Videos */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Vidéos récentes</CardTitle>
          <Link href="/creator/videos" className="text-[#D4AF37] text-sm hover:underline">Voir tout →</Link>
        </CardHeader>
        <CardContent>
          {profile.videos.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-10 w-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">Aucune vidéo encore</p>
              <Link href="/creator/generate" className="text-[#D4AF37] text-sm hover:underline mt-2 inline-block">
                Créer votre première vidéo →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.videos.map((video) => (
                <Link key={video.id} href={`/creator/videos/${video.id}`} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-colors min-h-[44px]">
                  <div className="h-12 w-16 sm:w-20 rounded bg-white/5 shrink-0 flex items-center justify-center">
                    <Video className="h-5 w-5 text-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{video.title}</p>
                    <p className="text-white/30 text-xs">{video.createdAt.toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 ${
                    video.status === 'PUBLISHED' ? 'border-green-500/30 text-green-400' :
                    video.status === 'GENERATING' ? 'border-yellow-500/30 text-yellow-400' :
                    video.status === 'READY' ? 'border-blue-500/30 text-blue-400' :
                    'border-white/10 text-white/40'
                  }`}>
                    {video.status === 'PUBLISHED' ? 'Publiée' :
                     video.status === 'GENERATING' ? 'En cours...' :
                     video.status === 'READY' ? 'Prête' :
                     video.status === 'DRAFT' ? 'Brouillon' : video.status}
                  </Badge>
                  <div className="text-right text-xs text-white/30 hidden sm:block">
                    <p className="flex items-center gap-1"><Eye className="h-3 w-3" /> {video.viewCount}</p>
                    <p className="flex items-center gap-1"><Heart className="h-3 w-3" /> {video.likeCount}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <Clapperboard className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-white font-medium">{profile.stageName}</p>
              <p className="text-white/40 text-sm">
                {profile.niche || 'Niche non définie'} · Style {profile.style.toLowerCase()}
              </p>
            </div>
          </div>
          <Link href="/creator/wizard" className="text-[#D4AF37] text-sm hover:underline">Modifier →</Link>
        </CardContent>
      </Card>
    </div>
  )
}
