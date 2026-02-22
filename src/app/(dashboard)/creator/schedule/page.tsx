import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  Video,
  Timer,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
} from 'lucide-react'

function getPlatformIcon(platform: string): string {
  const map: Record<string, string> = {
    TIKTOK: '(TT)',
    INSTAGRAM: '(IG)',
    YOUTUBE: '(YT)',
    FACEBOOK: '(FB)',
    X: '(X)',
  }
  return map[platform] ?? platform
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

function getPublishStatusVariant(status: string) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
    SCHEDULED: 'default',
    PUBLISHING: 'warning',
    PUBLISHED: 'success',
    FAILED: 'destructive',
    CANCELLED: 'outline',
  }
  return map[status] ?? 'outline'
}

function getDayName(dayIndex: number): string {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  return days[dayIndex] ?? ''
}

function getDayFullName(dayIndex: number): string {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  return days[dayIndex] ?? ''
}

export default async function SchedulePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !profile.wizardCompleted) {
    redirect('/creator/wizard')
  }

  // Get schedules for the current week and beyond
  const now = new Date()
  const startOfWeek = new Date(now)
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startOfWeek.setDate(now.getDate() + mondayOffset)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  endOfWeek.setHours(0, 0, 0, 0)

  const schedules = await prisma.publishSchedule.findMany({
    where: {
      video: {
        profileId: profile.id,
      },
      scheduledAt: {
        gte: startOfWeek,
        lt: endOfWeek,
      },
    },
    include: {
      video: {
        select: { id: true, title: true, thumbnailUrl: true, status: true },
      },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  // Also get upcoming schedules (beyond this week)
  const upcomingSchedules = await prisma.publishSchedule.findMany({
    where: {
      video: {
        profileId: profile.id,
      },
      scheduledAt: {
        gte: endOfWeek,
      },
    },
    include: {
      video: {
        select: { id: true, title: true, thumbnailUrl: true, status: true },
      },
    },
    orderBy: { scheduledAt: 'asc' },
    take: 10,
  })

  // Group schedules by day of week (0=Monday ... 6=Sunday)
  const weekDays: Array<{
    date: Date
    dayIndex: number
    isToday: boolean
    entries: typeof schedules
  }> = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    const dayEntries = schedules.filter((s) => {
      const sd = new Date(s.scheduledAt)
      return sd.getDate() === date.getDate()
        && sd.getMonth() === date.getMonth()
        && sd.getFullYear() === date.getFullYear()
    })

    weekDays.push({
      date,
      dayIndex: i,
      isToday:
        date.getDate() === now.getDate()
        && date.getMonth() === now.getMonth()
        && date.getFullYear() === now.getFullYear(),
      entries: dayEntries,
    })
  }

  const weekLabel = `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — ${new Date(endOfWeek.getTime() - 86400000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`

  const hasAnySchedules = schedules.length > 0 || upcomingSchedules.length > 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/creator"
            className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors shrink-0 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Calendrier de Publication
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              Planifiez et suivez vos publications sur toutes les plateformes
            </p>
          </div>
        </div>
        <Link
          href="/creator/generate"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors min-h-[44px]"
        >
          <Plus className="h-4 w-4" /> Nouvelle Vidéo
        </Link>
      </div>

      {/* Week Navigation */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/30">
              <ChevronLeft className="h-5 w-5 cursor-not-allowed" />
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">{weekLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-white/30">
              <ChevronRight className="h-5 w-5 cursor-not-allowed" />
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasAnySchedules ? (
        /* Empty State */
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-16 text-center">
            <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-white/10" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 font-[family-name:var(--font-playfair)]">
              Aucune publication planifiée
            </h3>
            <p className="text-white/30 text-sm mb-8 max-w-md mx-auto">
              Commencez par générer une vidéo, puis planifiez sa publication sur vos plateformes connectées.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/creator/generate"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors"
              >
                <Video className="h-4 w-4" /> Générer une Vidéo
              </Link>
              <Link
                href="/creator/accounts"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/70 font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Connecter un Compte
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Weekly Calendar Grid */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 min-w-[640px]">
            {/* Day Headers */}
            {weekDays.map((day) => (
              <div key={day.dayIndex} className="text-center">
                <div
                  className={`text-[10px] sm:text-xs font-medium mb-1 ${day.isToday ? 'text-[#D4AF37]' : 'text-white/30'}`}
                >
                  {getDayName(day.dayIndex)}
                </div>
                <div
                  className={`text-xs sm:text-sm font-bold mb-2 sm:mb-3 h-7 w-7 sm:h-8 sm:w-8 mx-auto flex items-center justify-center rounded-full ${
                    day.isToday
                      ? 'bg-[#D4AF37] text-black'
                      : 'text-white/60'
                  }`}
                >
                  {day.date.getDate()}
                </div>
              </div>
            ))}

            {/* Day Columns */}
            {weekDays.map((day) => (
              <div
                key={`col-${day.dayIndex}`}
                className={`min-h-[160px] sm:min-h-[200px] rounded-lg border p-1.5 sm:p-2 space-y-2 ${
                  day.isToday
                    ? 'border-[#D4AF37]/20 bg-[#D4AF37]/[0.03]'
                    : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                {day.entries.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-white/10 text-xs">-</span>
                  </div>
                ) : (
                  day.entries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/creator/videos/${entry.video.id}`}
                      className="block"
                    >
                      <div
                        className={`p-2 rounded-lg border text-xs space-y-1.5 hover:bg-white/[0.05] transition-colors ${getPlatformColor(entry.platform)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px]">
                            {getPlatformIcon(entry.platform)}
                          </span>
                          <Badge
                            variant={getPublishStatusVariant(entry.status)}
                            className="text-[9px] px-1.5 py-0"
                          >
                            {getPublishStatusLabel(entry.status)}
                          </Badge>
                        </div>
                        <p className="text-white/70 font-medium line-clamp-2 leading-tight">
                          {entry.video.title}
                        </p>
                        <div className="flex items-center gap-1 text-white/30">
                          <Clock className="h-2.5 w-2.5" />
                          <span className="text-[10px]">
                            {entry.scheduledAt.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {entry.jitterMinutes > 0 && (
                            <span className="text-[10px] flex items-center gap-0.5">
                              <Timer className="h-2.5 w-2.5" />
                              +/-{entry.jitterMinutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Upcoming (beyond this week) */}
          {upcomingSchedules.length > 0 && (
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
                  Prochaines Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSchedules.map((schedule) => (
                    <Link
                      key={schedule.id}
                      href={`/creator/videos/${schedule.video.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors min-h-[44px]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPlatformColor(schedule.platform)}`}
                        >
                          {schedule.platform}
                        </span>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {schedule.video.title}
                          </p>
                          <p className="text-white/30 text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {schedule.scheduledAt.toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                            })}{' '}
                            {schedule.scheduledAt.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {schedule.jitterMinutes > 0 && (
                              <span className="ml-1 text-white/20">
                                (jitter +/-{schedule.jitterMinutes}m)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getPublishStatusVariant(schedule.status)}>
                        {getPublishStatusLabel(schedule.status)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
