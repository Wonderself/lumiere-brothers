import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Video,
  Eye,
  Heart,
  Share2,
  Clock,
  Calendar,
  Trash2,
  FileText,
  Globe,
  Coins,
  CalendarClock,
} from 'lucide-react'
import { deleteVideoAction } from '@/app/actions/creator'

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Brouillon',
    GENERATING: 'Génération en cours...',
    READY: 'Prête',
    PUBLISHED: 'Publiée',
    FAILED: 'Échouée',
    ARCHIVED: 'Archivée',
  }
  return map[status] ?? status
}

function getStatusBadgeVariant(status: string) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
    DRAFT: 'secondary',
    GENERATING: 'warning',
    READY: 'default',
    PUBLISHED: 'success',
    FAILED: 'destructive',
    ARCHIVED: 'outline',
  }
  return map[status] ?? 'outline'
}

function getPublishStatusLabel(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: 'Planifié',
    PUBLISHING: 'Publication...',
    PUBLISHED: 'Publié',
    FAILED: 'Échoué',
    CANCELLED: 'Annulé',
  }
  return map[status] ?? status
}

function getPlatformColor(platform: string): string {
  const map: Record<string, string> = {
    TIKTOK: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    INSTAGRAM: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    YOUTUBE: 'text-red-400 bg-red-500/10 border-red-500/20',
    FACEBOOK: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    X: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  }
  return map[platform] ?? 'text-white/50 bg-white/5 border-white/10'
}

export default async function VideoDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const params = await props.params

  const video = await prisma.generatedVideo.findUnique({
    where: { id: params.id },
    include: {
      profile: {
        select: { userId: true, stageName: true },
      },
      schedules: {
        orderBy: { scheduledAt: 'asc' },
      },
    },
  })

  if (!video) notFound()
  if (video.profile.userId !== session.user.id) redirect('/creator/videos')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/creator/videos"
            className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors shrink-0 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)] truncate">
              {video.title}
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {video.createdAt.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <Badge
          variant={getStatusBadgeVariant(video.status)}
          className="text-sm px-3 py-1 self-start sm:self-auto shrink-0"
        >
          {getStatusLabel(video.status)}
        </Badge>
      </div>

      {/* Video Preview + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Video Player / Thumbnail */}
        <div className="md:col-span-2">
          <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={video.thumbnailUrl ?? undefined}
                />
              ) : video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Video className="h-16 w-16 text-white/10" />
                  <span className="text-white/20 text-sm">
                    {video.status === 'GENERATING'
                      ? 'Vidéo en cours de génération...'
                      : 'Aperçu non disponible'}
                  </span>
                </div>
              )}
              {video.duration && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/80 text-white text-xs font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}s
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white/50">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/60 text-sm">
                  <Eye className="h-4 w-4 text-[#D4AF37]" />
                  Vues
                </span>
                <span className="text-white font-bold text-lg">
                  {video.viewCount.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/60 text-sm">
                  <Heart className="h-4 w-4 text-red-400" />
                  Likes
                </span>
                <span className="text-white font-bold text-lg">
                  {video.likeCount.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/60 text-sm">
                  <Share2 className="h-4 w-4 text-blue-400" />
                  Partages
                </span>
                <span className="text-white font-bold text-lg">
                  {video.shareCount.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/60 text-sm">
                  <Coins className="h-4 w-4 text-[#D4AF37]" />
                  Tokens
                </span>
                <span className="text-white/50 font-medium text-sm">
                  {video.tokensSpent} dépensés
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Platforms */}
          {video.platforms.length > 0 && (
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/50 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Plateformes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {video.platforms.map((p) => (
                    <span
                      key={p}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getPlatformColor(p)}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Script Section */}
      {video.script && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#D4AF37]" />
              Script
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {video.script}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish Schedules */}
      {video.schedules.length > 0 && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-[#D4AF37]" />
              Planification de Publication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {video.schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPlatformColor(schedule.platform)}`}
                    >
                      {schedule.platform}
                    </span>
                    <div>
                      <p className="text-white text-sm">
                        {schedule.scheduledAt.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        {schedule.scheduledAt.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {schedule.jitterMinutes > 0 && (
                        <p className="text-white/30 text-xs">
                          Jitter : +/- {schedule.jitterMinutes} min
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      schedule.status === 'PUBLISHED' ? 'success'
                        : schedule.status === 'FAILED' ? 'destructive'
                        : schedule.status === 'CANCELLED' ? 'outline'
                        : 'warning'
                    }
                  >
                    {getPublishStatusLabel(schedule.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-white/50 text-sm">Actions</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {video.status === 'READY' && (
              <Link
                href="/creator/schedule"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-medium rounded-lg hover:bg-[#D4AF37]/20 transition-colors text-sm"
              >
                <CalendarClock className="h-4 w-4" />
                Planifier
              </Link>
            )}
            <form action={deleteVideoAction}>
              <input type="hidden" name="videoId" value={video.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/20 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
