import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Plus,
  Users,
  RefreshCw,
  CheckCircle2,
  XCircle,
  LinkIcon,
  TrendingUp,
} from 'lucide-react'
import { connectSocialAccountAction } from '@/app/actions/creator'

const PLATFORM_CONFIG = {
  TIKTOK: {
    label: 'TikTok',
    icon: '(TT)',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    gradient: 'from-pink-500/20 to-purple-500/20',
  },
  INSTAGRAM: {
    label: 'Instagram',
    icon: '(IG)',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    gradient: 'from-purple-500/20 to-orange-500/20',
  },
  YOUTUBE: {
    label: 'YouTube',
    icon: '(YT)',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    gradient: 'from-red-500/20 to-red-600/20',
  },
  FACEBOOK: {
    label: 'Facebook',
    icon: '(FB)',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    gradient: 'from-blue-500/20 to-blue-600/20',
  },
  X: {
    label: 'X (Twitter)',
    icon: '(X)',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    gradient: 'from-sky-500/20 to-gray-500/20',
  },
} as const

type PlatformKey = keyof typeof PLATFORM_CONFIG

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}

function timeAgo(date: Date | null): string {
  if (!date) return 'Jamais synchronisé'
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return 'Il y a quelques secondes'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default async function AccountsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const accounts = await prisma.socialAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  const connectedPlatforms = new Set(accounts.map((a) => a.platform))
  const totalFollowers = accounts.reduce((sum, a) => sum + a.followersCount, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
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
              Comptes Sociaux
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              Connectez et gérez vos comptes pour la publication automatique
            </p>
          </div>
        </div>
        {accounts.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 self-start sm:self-auto">
            <Users className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold">{formatFollowers(totalFollowers)}</span>
            <span className="text-white/40 text-sm">followers total</span>
          </div>
        )}
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-[#D4AF37]" />
            Comptes connectés ({accounts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {accounts.map((account) => {
              const config = PLATFORM_CONFIG[account.platform as PlatformKey]
              if (!config) return null
              return (
                <Card
                  key={account.id}
                  className="bg-white/[0.03] border-white/10 hover:border-white/15 transition-all duration-200"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center justify-center`}
                        >
                          <span className={`font-bold text-sm ${config.color}`}>
                            {config.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{config.label}</p>
                          <p className="text-white/40 text-sm">@{account.handle}</p>
                        </div>
                      </div>
                      <Badge
                        variant={account.isActive ? 'success' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {account.isActive ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {account.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Followers */}
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Users className="h-3.5 w-3.5 text-white/30" />
                          <span className="text-white/30 text-xs">Followers</span>
                        </div>
                        <p className={`text-lg font-bold ${config.color}`}>
                          {formatFollowers(account.followersCount)}
                        </p>
                      </div>

                      {/* Engagement */}
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-white/30" />
                          <span className="text-white/30 text-xs">Engagement</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {account.engagementRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Last Sync */}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-white/20 text-xs flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        {timeAgo(account.lastSyncAt)}
                      </p>
                      <span className="text-white/10 text-xs">
                        Ajouté le {account.createdAt.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Add New Account Form */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#D4AF37]" />
            Connecter un Nouveau Compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={async (formData: FormData) => {
            'use server'
            await connectSocialAccountAction(null, formData)
          }} className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-3">
              <Label>Plateforme</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                {(Object.entries(PLATFORM_CONFIG) as [PlatformKey, typeof PLATFORM_CONFIG[PlatformKey]][]).map(
                  ([key, config]) => {
                    const isConnected = connectedPlatforms.has(key)
                    return (
                      <label
                        key={key}
                        className={`cursor-pointer ${isConnected ? 'opacity-40 pointer-events-none' : ''}`}
                      >
                        <input
                          type="radio"
                          name="platform"
                          value={key}
                          disabled={isConnected}
                          className="peer sr-only"
                        />
                        <div
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${config.bgColor} ${config.borderColor} peer-checked:ring-2 peer-checked:ring-offset-0 peer-checked:ring-[#D4AF37]/50 peer-checked:border-[#D4AF37]`}
                        >
                          <span className={`text-lg font-bold ${config.color}`}>
                            {config.icon}
                          </span>
                          <span className="text-white/70 text-xs font-medium">
                            {config.label}
                          </span>
                          {isConnected && (
                            <span className="text-green-400/60 text-[10px]">Connecté</span>
                          )}
                        </div>
                      </label>
                    )
                  }
                )}
              </div>
            </div>

            {/* Handle Input */}
            <div className="space-y-2">
              <Label htmlFor="handle">Identifiant / Nom d&apos;utilisateur</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                <Input
                  id="handle"
                  name="handle"
                  placeholder="votre_nom_utilisateur"
                  required
                  className="pl-8"
                />
              </div>
              <p className="text-white/20 text-xs">
                Entrez votre identifiant sans le @ (ex: votre_nom)
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors"
            >
              <LinkIcon className="h-4 w-4" />
              Connecter le Compte
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Empty state when no accounts */}
      {accounts.length === 0 && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white/10" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 font-[family-name:var(--font-playfair)]">
              Aucun compte connecté
            </h3>
            <p className="text-white/30 text-sm max-w-md mx-auto">
              Connectez vos comptes de réseaux sociaux pour publier vos vidéos automatiquement sur toutes vos plateformes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-[#D4AF37]/[0.03] border-[#D4AF37]/10">
        <CardContent className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
          <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
            <RefreshCw className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Synchronisation automatique</p>
            <p className="text-white/30 text-xs mt-1 leading-relaxed">
              Les statistiques de vos comptes (followers, engagement) sont synchronisées automatiquement
              toutes les 6 heures. Les publications planifiées sont postées via les API officielles
              de chaque plateforme.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
