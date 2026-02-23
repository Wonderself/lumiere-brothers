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
  Eye, Filter, Trophy
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          Collabs & Growth
        </h1>
        <p className="text-gray-400 mt-1.5 text-sm">
          Trouvez des créateurs pour collaborer et grandir ensemble
        </p>
      </div>

      {/* Nav pills */}
      <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200 max-w-full overflow-x-auto scrollbar-thin">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[40px] ${
              link.active
                ? 'bg-[#D4AF37] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <link.icon className="h-4 w-4" /> {link.label}
          </Link>
        ))}
      </nav>

      {/* Active collabs banner */}
      {myCollabs.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <Handshake className="h-5 w-5 text-[#D4AF37] shrink-0" />
          <p className="text-gray-700 text-sm">
            <span className="text-gray-900 font-medium">{myCollabs.length}</span> collab(s) en cours
          </p>
          <Link href="/collabs/orders" className="ml-auto text-[#D4AF37] text-sm font-medium hover:text-[#C5A028] transition-colors">
            Voir
          </Link>
        </div>
      )}

      {/* Filters */}
      <form className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
        <div className="flex-1 min-w-0 sm:min-w-[200px]">
          <label className="block text-gray-500 text-xs mb-1.5">Niche</label>
          <select
            name="niche"
            defaultValue={nicheFilter}
            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
          >
            <option value="">Toutes les niches</option>
            {allNiches.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="min-w-0 sm:min-w-[160px]">
          <label className="block text-gray-500 text-xs mb-1.5">Followers min.</label>
          <select
            name="minFollowers"
            defaultValue={minFollowers.toString()}
            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
          >
            <option value="0">Tous</option>
            <option value="1000">1K+</option>
            <option value="10000">10K+</option>
            <option value="100000">100K+</option>
          </select>
        </div>
        <button
          type="submit"
          className="h-11 px-6 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#C5A028] transition-colors inline-flex items-center gap-2"
        >
          <Filter className="h-4 w-4" /> Filtrer
        </button>
      </form>

      {/* Results count */}
      <p className="text-gray-400 text-sm">{filteredCreators.length} créateur(s) disponible(s)</p>

      {/* Creators Grid */}
      {filteredCreators.length === 0 ? (
        <div className="py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-5">
            <Users className="h-8 w-8 text-gray-200" />
          </div>
          <h3 className="text-gray-500 text-lg font-medium mb-2">Aucun créateur trouvé</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Ajustez vos filtres ou revenez plus tard. De nouveaux créateurs rejoignent la plateforme chaque jour.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => {
            const profile = creator.creatorProfile!
            const badge = getBadgeForScore(creator.reputationScore)

            return (
              <Link key={creator.id} href={`/collabs/${creator.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-md transition-all cursor-pointer h-full group p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {creator.avatarUrl && <AvatarImage src={creator.avatarUrl} alt={profile.stageName || ''} />}
                      <AvatarFallback className="text-sm bg-amber-50 text-[#D4AF37]">
                        {getInitials(profile.stageName || creator.displayName || 'CR')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold truncate">
                        {profile.stageName || creator.displayName || 'Créateur'}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {profile.niche || 'Multi-niche'}
                      </p>
                    </div>
                  </div>

                  {/* Key info */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{creator.totalFollowers.toLocaleString()}</span>
                    </div>
                    <Badge
                      className="text-[10px]"
                      style={{
                        borderColor: `${badge.color}30`,
                        backgroundColor: `${badge.color}10`,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </Badge>
                  </div>

                  {/* CTA */}
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[#D4AF37] text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                      Collaborer
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
