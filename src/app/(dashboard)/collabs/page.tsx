import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getBadgeForScore } from '@/lib/reputation'
import { getInitials } from '@/lib/utils'
import {
  Users, Handshake, ShoppingBag, Share2, Megaphone,
  Star, TrendingUp, Eye, Filter, Trophy
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Collabs — Marketplace' }

export default async function CollabsMarketplacePage(
  props: { searchParams: Promise<{ niche?: string; minFollowers?: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const searchParams = await props.searchParams
  const nicheFilter = searchParams.niche || ''
  const minFollowers = parseInt(searchParams.minFollowers || '0', 10)

  // Fetch creators with profiles
  const creators = await prisma.user.findMany({
    where: {
      creatorProfile: { isNot: null },
      id: { not: session.user.id },
      ...(nicheFilter ? { creatorProfile: { niche: { contains: nicheFilter, mode: 'insensitive' } } } : {}),
    },
    include: {
      creatorProfile: true,
      socialAccounts: true,
      _count: {
        select: {
          receivedCollabs: { where: { status: 'COMPLETED' } },
        },
      },
    },
    orderBy: { reputationScore: 'desc' },
    take: 50,
  })

  // Filter by total followers if needed
  const filteredCreators = creators
    .map((user) => {
      const totalFollowers = user.socialAccounts.reduce((sum, acc) => sum + acc.followersCount, 0)
      return { ...user, totalFollowers }
    })
    .filter((u) => u.totalFollowers >= minFollowers)

  // Get current user's pending/active collabs
  const myCollabs = await prisma.collabRequest.findMany({
    where: {
      OR: [
        { fromUserId: session.user.id },
        { toUserId: session.user.id },
      ],
      status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
    },
    include: {
      fromUser: { select: { id: true, displayName: true } },
      toUser: { select: { id: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  // Collect unique niches for filter
  const allNiches = [...new Set(
    creators
      .map((c) => c.creatorProfile?.niche)
      .filter(Boolean) as string[]
  )]

  const navLinks = [
    { href: '/collabs', label: 'Marketplace', icon: Users, active: true },
    { href: '/collabs/orders', label: 'Commandes', icon: ShoppingBag, active: false },
    { href: '/collabs/referrals', label: 'Parrainage', icon: Share2, active: false },
    { href: '/collabs/achievements', label: 'Accomplissements', icon: Trophy, active: false },
    { href: '/collabs/outreach', label: 'Outreach', icon: Megaphone, active: false },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Collabs & Growth
          </h1>
          <p className="text-white/40 mt-1 text-sm sm:text-base">
            Trouvez des createurs pour collaborer et grandir ensemble
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/collabs/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-colors border border-white/10 min-h-[44px]"
          >
            <ShoppingBag className="h-4 w-4" /> Commandes
          </Link>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[44px] ${
              link.active
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <link.icon className="h-4 w-4" /> {link.label}
          </Link>
        ))}
      </div>

      {/* Active collabs banner */}
      {myCollabs.length > 0 && (
        <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Handshake className="h-5 w-5 text-[#D4AF37]" />
              <p className="text-white font-medium">Collabs en cours ({myCollabs.length})</p>
            </div>
            <div className="space-y-2">
              {myCollabs.map((collab) => {
                const isFrom = collab.fromUserId === session.user.id
                const partner = isFrom ? collab.toUser : collab.fromUser
                return (
                  <div key={collab.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{partner.displayName || 'Createur'}</span>
                      <Badge variant="outline" className="text-xs">
                        {collab.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Badge
                      variant={collab.status === 'PENDING' ? 'warning' : 'success'}
                      className="text-xs"
                    >
                      {collab.status === 'PENDING' ? 'En attente' :
                       collab.status === 'ACCEPTED' ? 'Acceptee' : 'En cours'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4">
          <form className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3 sm:gap-4">
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <label className="block text-white/50 text-xs mb-1.5">Niche</label>
              <select
                name="niche"
                defaultValue={nicheFilter}
                className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="" className="bg-[#111]">Toutes les niches</option>
                {allNiches.map((n) => (
                  <option key={n} value={n} className="bg-[#111]">{n}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0 sm:min-w-[180px]">
              <label className="block text-white/50 text-xs mb-1.5">Followers min.</label>
              <select
                name="minFollowers"
                defaultValue={minFollowers.toString()}
                className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="0" className="bg-[#111]">Tous</option>
                <option value="1000" className="bg-[#111]">1K+</option>
                <option value="10000" className="bg-[#111]">10K+</option>
                <option value="50000" className="bg-[#111]">50K+</option>
                <option value="100000" className="bg-[#111]">100K+</option>
              </select>
            </div>
            <button
              type="submit"
              className="h-10 px-5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors inline-flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> Filtrer
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Createurs', value: filteredCreators.length, icon: Users, color: 'text-blue-400' },
          { label: 'Mes collabs', value: myCollabs.length, icon: Handshake, color: 'text-[#D4AF37]' },
          { label: 'Score moyen', value: Math.round(filteredCreators.reduce((s, c) => s + c.reputationScore, 0) / Math.max(filteredCreators.length, 1)), icon: TrendingUp, color: 'text-green-400' },
          { label: 'Collabs total', value: filteredCreators.reduce((s, c) => s + c._count.receivedCollabs, 0), icon: Star, color: 'text-purple-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Creators Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 font-[family-name:var(--font-playfair)]">
          Createurs disponibles
        </h2>
        {filteredCreators.length === 0 ? (
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-lg">Aucun createur trouve</p>
              <p className="text-white/20 text-sm mt-1">Essayez d&apos;ajuster vos filtres</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredCreators.map((creator) => {
              const profile = creator.creatorProfile!
              const badge = getBadgeForScore(creator.reputationScore)
              const platforms = creator.socialAccounts.map((a) => a.platform)

              return (
                <Link key={creator.id} href={`/collabs/${creator.id}`}>
                  <Card className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/20 hover:bg-white/[0.05] transition-all cursor-pointer h-full">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-12 w-12">
                          {creator.avatarUrl && <AvatarImage src={creator.avatarUrl} alt={profile.stageName || ''} />}
                          <AvatarFallback>
                            {getInitials(profile.stageName || creator.displayName || 'CR')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">
                            {profile.stageName || creator.displayName || 'Createur'}
                          </p>
                          <p className="text-white/40 text-sm truncate">
                            {profile.niche || 'Multi-niche'}
                          </p>
                        </div>
                        <Badge
                          className="text-xs shrink-0"
                          style={{
                            borderColor: `${badge.color}40`,
                            backgroundColor: `${badge.color}15`,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </Badge>
                      </div>

                      {/* Bio */}
                      {profile.bio && (
                        <p className="text-white/30 text-sm mb-4 line-clamp-2">{profile.bio}</p>
                      )}

                      {/* Stats row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-white/40">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{creator.totalFollowers.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/40">
                          <Star className="h-3.5 w-3.5" />
                          <span>{creator.reputationScore.toFixed(0)}/100</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/40">
                          <Handshake className="h-3.5 w-3.5" />
                          <span>{creator._count.receivedCollabs} collabs</span>
                        </div>
                      </div>

                      {/* Platforms */}
                      {platforms.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3">
                          {platforms.map((p) => (
                            <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {p === 'TIKTOK' ? 'TikTok' :
                               p === 'INSTAGRAM' ? 'Insta' :
                               p === 'YOUTUBE' ? 'YouTube' :
                               p === 'FACEBOOK' ? 'FB' : 'X'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
