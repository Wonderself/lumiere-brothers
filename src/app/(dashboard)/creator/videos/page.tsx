import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Video,
  Eye,
  Heart,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  Loader2,
  FileVideo,
  AlertTriangle,
  Archive,
} from 'lucide-react'

const STATUS_CONFIG = {
  ALL: { label: 'Toutes', icon: Filter, badgeClass: '' },
  DRAFT: { label: 'Brouillons', icon: FileVideo, badgeClass: 'border-white/20 text-white/50 bg-white/5' },
  GENERATING: { label: 'En cours', icon: Loader2, badgeClass: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' },
  READY: { label: 'Prêtes', icon: CheckCircle2, badgeClass: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  PUBLISHED: { label: 'Publiées', icon: CheckCircle2, badgeClass: 'border-green-500/30 text-green-400 bg-green-500/10' },
  FAILED: { label: 'Échouées', icon: AlertTriangle, badgeClass: 'border-red-500/30 text-red-400 bg-red-500/10' },
  ARCHIVED: { label: 'Archivées', icon: Archive, badgeClass: 'border-white/10 text-white/30 bg-white/5' },
} as const

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Brouillon',
    GENERATING: 'Génération...',
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

export default async function VideosPage(
  props: { searchParams: Promise<{ status?: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const searchParams = await props.searchParams

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !profile.wizardCompleted) {
    redirect('/creator/wizard')
  }

  const statusFilter = searchParams.status
  const whereClause: Record<string, unknown> = { profileId: profile.id }
  if (statusFilter && statusFilter !== 'ALL') {
    whereClause.status = statusFilter
  }

  const videos = await prisma.generatedVideo.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  })

  const activeFilter = statusFilter || 'ALL'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Mes Vidéos
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {videos.length} vidéo{videos.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/creator/generate"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors min-h-[44px]"
        >
          <Plus className="h-4 w-4" /> Nouvelle Vidéo
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['ALL', 'DRAFT', 'GENERATING', 'READY', 'PUBLISHED'] as const).map((status) => {
          const config = STATUS_CONFIG[status]
          const isActive = activeFilter === status
          return (
            <Link
              key={status}
              href={status === 'ALL' ? '/creator/videos' : `/creator/videos?status=${status}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]'
                  : 'bg-white/[0.03] border border-white/5 text-white/50 hover:text-white/70 hover:border-white/10'
              }`}
            >
              <config.icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
              {config.label}
            </Link>
          )
        })}
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-white/10" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {activeFilter === 'ALL'
                ? 'Aucune vidéo encore'
                : `Aucune vidéo ${getStatusLabel(activeFilter).toLowerCase()}`}
            </h3>
            <p className="text-white/30 text-sm mb-6">
              Commencez par générer votre première vidéo avec l&apos;IA.
            </p>
            <Link
              href="/creator/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors"
            >
              <Plus className="h-4 w-4" /> Créer une Vidéo
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {videos.map((video) => (
            <Link key={video.id} href={`/creator/videos/${video.id}`}>
              <Card className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/20 hover:bg-white/[0.05] transition-all duration-300 group h-full">
                {/* Thumbnail Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-t-xl overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-10 w-10 text-white/10 group-hover:text-white/20 transition-colors" />
                    </div>
                  )}
                  {/* Status badge overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={getStatusBadgeVariant(video.status)}>
                      {getStatusLabel(video.status)}
                    </Badge>
                  </div>
                  {/* Duration overlay */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.duration}s
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                    {video.title}
                  </h3>

                  {/* Date */}
                  <p className="text-white/30 text-xs">
                    {video.createdAt.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Platforms */}
                  {video.platforms.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {video.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1 text-white/30 text-xs">
                      <Eye className="h-3 w-3" /> {video.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-white/30 text-xs">
                      <Heart className="h-3 w-3" /> {video.likeCount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
