import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, getLevelColor, getInitials } from '@/lib/utils'
import {
  Star,
  Trophy,
  CheckCircle,
  Coins,
  Globe,
  Wallet,
  Calendar,
  ShieldCheck,
} from 'lucide-react'
import { ProfileEditDialog } from './profile-edit-dialog'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mon Profil' }

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  CONTRIBUTOR: 'Contributeur',
  ARTIST: 'Artiste',
  STUNT_PERFORMER: 'Cascadeur',
  VIEWER: 'Spectateur',
  SCREENWRITER: 'Scenariste',
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      portfolioUrl: true,
      walletAddress: true,
      role: true,
      level: true,
      skills: true,
      languages: true,
      points: true,
      tasksCompleted: true,
      tasksValidated: true,
      lumenBalance: true,
      isVerified: true,
      createdAt: true,
    },
  })

  if (!user) redirect('/login')

  const stats = [
    {
      icon: Star,
      label: 'Points',
      value: user.points.toLocaleString('fr-FR'),
      color: 'text-[#D4AF37]',
      bgColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/20',
    },
    {
      icon: CheckCircle,
      label: 'Taches Completees',
      value: user.tasksCompleted.toString(),
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/20',
    },
    {
      icon: Trophy,
      label: 'Taches Validees',
      value: user.tasksValidated.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Coins,
      label: 'Solde Lumens',
      value: user.lumenBalance.toLocaleString('fr-FR'),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* ── User Info Card (Glass) ── */}
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-xl">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-purple-500/5 pointer-events-none" />
        <CardContent className="relative p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-2 border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.displayName || 'Avatar'} />
              )}
              <AvatarFallback className="text-lg">
                {getInitials(user.displayName || user.email)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {user.displayName || 'Createur'}
                </h1>
                <Badge
                  variant="secondary"
                  className={`${getLevelColor(user.level)} border-current/20`}
                >
                  {user.level}
                </Badge>
                <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37]/30">
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
                {user.isVerified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verifie
                  </Badge>
                )}
              </div>

              <p className="text-white/50 text-sm mb-1">{user.email}</p>

              <div className="flex items-center gap-4 text-xs text-white/30 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Membre depuis {formatDate(user.createdAt)}
                </span>
                {user.walletAddress && (
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5" />
                    Wallet connecte
                  </span>
                )}
              </div>
            </div>

            {/* Edit button */}
            <div className="shrink-0 self-start">
              <ProfileEditDialog
                user={{
                  displayName: user.displayName,
                  bio: user.bio,
                  avatarUrl: user.avatarUrl,
                  portfolioUrl: user.portfolioUrl,
                  skills: user.skills,
                  languages: user.languages,
                  walletAddress: user.walletAddress,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border bg-white/[0.02] backdrop-blur-sm ${stat.bgColor}`}
          >
            <CardContent className="p-5 text-center">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${stat.bgColor} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: 'var(--font-playfair)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Bio Section ── */}
      {user.bio && (
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <CardContent className="p-6">
            <h2
              className="text-lg font-semibold text-white mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              A propos
            </h2>
            <p className="text-white/60 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* ── Skills & Languages ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills */}
        {user.skills.length > 0 && (
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <CardContent className="p-6">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Competences
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Languages */}
        {user.languages.length > 0 && (
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <CardContent className="p-6">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Langues
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/10"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Portfolio Link ── */}
      {user.portfolioUrl && (
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <CardContent className="p-6">
            <h2
              className="text-lg font-semibold text-white mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Portfolio
            </h2>
            <a
              href={user.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F0D060] transition-colors text-sm"
            >
              <Globe className="h-4 w-4" />
              {user.portfolioUrl}
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
