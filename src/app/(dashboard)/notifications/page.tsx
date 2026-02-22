import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Briefcase,
  CheckCircle,
  XCircle,
  FileSearch,
  CreditCard,
  TrendingUp,
  ExternalLink,
  InboxIcon,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { markNotificationReadAction, markAllNotificationsReadAction } from '@/app/actions/notifications'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notifications' }

const NOTIF_ICONS: Record<string, typeof Bell> = {
  NEW_TASK_AVAILABLE: Briefcase,
  TASK_VALIDATED: CheckCircle,
  TASK_REJECTED: XCircle,
  SUBMISSION_REVIEWED: FileSearch,
  PAYMENT_RECEIVED: CreditCard,
  LEVEL_UP: TrendingUp,
  SYSTEM: Bell,
}

const NOTIF_COLORS: Record<string, string> = {
  NEW_TASK_AVAILABLE: 'text-blue-400',
  TASK_VALIDATED: 'text-green-400',
  TASK_REJECTED: 'text-red-400',
  SUBMISSION_REVIEWED: 'text-yellow-400',
  PAYMENT_RECEIVED: 'text-emerald-400',
  LEVEL_UP: 'text-[#D4AF37]',
  SYSTEM: 'text-white/50',
}

function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "A l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return formatDate(date)
}

function groupByDate<T extends { createdAt: Date }>(notifications: T[]): {
  label: string
  items: T[]
}[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)

  const groups: { label: string; items: T[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: 'Hier', items: [] },
    { label: 'Plus ancien', items: [] },
  ]

  for (const notif of notifications) {
    const notifDate = new Date(notif.createdAt)
    if (notifDate >= today) {
      groups[0].items.push(notif)
    } else if (notifDate >= yesterday) {
      groups[1].items.push(notif)
    } else {
      groups[2].items.push(notif)
    }
  }

  return groups.filter((g) => g.items.length > 0)
}

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const grouped = groupByDate(notifications)

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-white/40 mt-1">
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsReadAction}>
            <Button variant="outline" size="sm" type="submit">
              <CheckCircle className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </form>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <InboxIcon className="h-12 w-12 text-white/15 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-1">Aucune notification</p>
            <p className="text-white/25 text-sm">
              Vos notifications apparaitront ici
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-medium text-white/30 uppercase tracking-wider mb-3 px-1">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.items.map((notification) => {
                  const Icon = NOTIF_ICONS[notification.type] || Bell
                  const iconColor = NOTIF_COLORS[notification.type] || 'text-white/50'
                  const isUnread = !notification.read

                  return (
                    <Card
                      key={notification.id}
                      variant="glass"
                      className={`transition-all ${
                        isUnread
                          ? 'border-l-2 border-l-[#D4AF37] bg-white/[0.06]'
                          : 'opacity-70'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`mt-0.5 p-2 rounded-lg bg-white/[0.05] ${iconColor}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p
                                  className={`text-sm font-medium ${
                                    isUnread ? 'text-white' : 'text-white/60'
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                {notification.body && (
                                  <p className="text-xs text-white/40 mt-1 line-clamp-2">
                                    {notification.body}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-white/25 shrink-0 mt-0.5">
                                {timeAgo(notification.createdAt)}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-2">
                              {notification.href && (
                                <Link href={notification.href}>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-[#D4AF37] hover:text-[#F0D060]">
                                    Voir <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                </Link>
                              )}
                              {isUnread && (
                                <form action={markNotificationReadAction.bind(null, notification.id)}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    type="submit"
                                    className="h-7 text-xs text-white/30 hover:text-white/60"
                                  >
                                    Marquer comme lu
                                  </Button>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
