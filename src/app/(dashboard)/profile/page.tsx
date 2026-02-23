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
  Clapperboard,
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
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      icon: CheckCircle,
      label: 'Taches Completees',
      value: user.tasksCompleted.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-50 border-green-100',
    },
    {
      icon: Trophy,
      label: 'Taches Validees',
      value: user.tasksValidated.toString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 border-blue-100',
    },
    {
      icon: Coins,
      label: 'Solde Lumens',
      value: user.lumenBalance.toLocaleString('fr-FR'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 border-purple-100',
    },
  ]

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* ── User Info Card ── */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-purple-50/30 pointer-events-none" />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-2 border-[#D4AF37]/20 shadow-md">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.displayName || 'Avatar'} />
              )}
              <AvatarFallback className="text-lg bg-amber-50 text-[#D4AF37]">
                {getInitials(user.displayName || user.email)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1
                  className="text-3xl font-bold text-gray-900"
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
                  <Badge className="bg-green-50 text-green-600 border-green-200 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verifie
                  </Badge>
                )}
              </div>

              <p className="text-gray-500 text-sm mb-1">{user.email}</p>

              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
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
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`border bg-white rounded-2xl shadow-sm ${stat.bgColor}`}
          >
            <div className="p-5 text-center">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${stat.bgColor} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: 'var(--font-playfair)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Profile Completion CTA ── */}
      {!user.bio && user.skills.length === 0 && user.languages.length === 0 && (
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-[#D4AF37]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-transparent pointer-events-none" />
          <div className="relative p-8 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-50 border border-[#D4AF37]/20 mb-5">
              <Clapperboard className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Completez votre profil
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Un profil complet augmente votre visibilite dans la communaute et vous donne acces a plus de missions.
            </p>
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
      )}

      {/* ── Bio Section ── */}
      {user.bio && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2
            className="text-lg font-semibold text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            A propos
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
        </div>
      )}

      {/* ── Skills & Languages ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills */}
        {user.skills.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2
              className="text-lg font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Competences
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-[#D4AF37] border border-amber-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {user.languages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2
              className="text-lg font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Langues
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Portfolio Link ── */}
      {user.portfolioUrl && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2
            className="text-lg font-semibold text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Portfolio
          </h2>
          <a
            href={user.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#C5A028] transition-colors text-sm"
          >
            <Globe className="h-4 w-4" />
            {user.portfolioUrl}
          </a>
        </div>
      )}
    </div>
  )
}
