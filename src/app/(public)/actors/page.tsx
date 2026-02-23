import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Search, Users, Film, Heart, ChevronRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ACTOR_STYLE_LABELS } from '@/lib/constants'
import { formatFollowers, getNationalityFlag } from '@/lib/actors'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Acteurs IA — Les Talents Virtuels du Cinema',
  description:
    'Decouvrez les acteurs generes par IA qui donnent vie au cinema de demain. Profils, filmographies, bonus exclusifs.',
  openGraph: {
    title: 'Acteurs IA — Les Talents Virtuels du Cinema | Lumiere',
    description: 'Decouvrez les acteurs generes par IA qui donnent vie au cinema de demain.',
  },
}

const STYLE_COLORS: Record<string, string> = {
  DRAMATIC: 'border-purple-200 bg-purple-50 text-purple-600',
  COMEDY: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  ACTION: 'border-red-200 bg-red-50 text-red-600',
  VERSATILE: 'border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]',
  HORROR: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  ROMANCE: 'border-pink-200 bg-pink-50 text-pink-600',
  EXPERIMENTAL: 'border-cyan-200 bg-cyan-50 text-cyan-600',
}

async function getActors(search?: string, style?: string) {
  try {
    return await prisma.aIActor.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { nationality: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
        ...(style && style !== 'ALL' ? { style: style as any } : {}),
      },
      orderBy: [{ filmCount: 'desc' }, { socialFollowers: 'desc' }, { name: 'asc' }],
    })
  } catch {
    return []
  }
}

async function getStats() {
  try {
    const [actorCount, totalFilms, totalFollowers] = await Promise.all([
      prisma.aIActor.count({ where: { isActive: true } }),
      prisma.aIActor.aggregate({ where: { isActive: true }, _sum: { filmCount: true } }),
      prisma.aIActor.aggregate({ where: { isActive: true }, _sum: { socialFollowers: true } }),
    ])
    return {
      actors: actorCount,
      films: totalFilms._sum.filmCount || 0,
      followers: totalFollowers._sum.socialFollowers || 0,
    }
  } catch {
    return { actors: 0, films: 0, followers: 0 }
  }
}

export default async function ActorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const actors = await getActors(params.q, params.style)
  const stats = await getStats()

  const styles = ['ALL', ...Object.keys(ACTOR_STYLE_LABELS)] as const

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.03] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-100/40 rounded-full blur-[100px]" />

        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-xs sm:text-sm mb-4 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Intelligence Artificielle Cinematographique</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nos{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Acteurs IA
              </span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Decouvrez les talents virtuels qui donnent vie au cinema de demain.
              Chaque acteur est unique, avec sa personnalite, son style et son histoire.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-6 sm:gap-8 md:gap-16 mb-8 sm:mb-12">
            {[
              { label: 'Acteurs', value: stats.actors, icon: Users },
              { label: 'Films', value: stats.films, icon: Film },
              { label: 'Fans', value: formatFollowers(stats.followers), icon: Heart },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4AF37]/60" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto mb-6 sm:mb-8">
            <form className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              <input
                name="q"
                type="text"
                placeholder="Rechercher un acteur..."
                defaultValue={params.q || ''}
                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
              />
              {params.style && <input type="hidden" name="style" value={params.style} />}
            </form>
          </div>

          {/* Style Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {styles.map((s) => {
              const isActive = (!params.style && s === 'ALL') || params.style === s
              const href =
                s === 'ALL'
                  ? params.q
                    ? `/actors?q=${params.q}`
                    : '/actors'
                  : params.q
                  ? `/actors?q=${params.q}&style=${s}`
                  : `/actors?style=${s}`
              return (
                <Link
                  key={s}
                  href={href}
                  className={`px-4 py-2 sm:px-5 rounded-full text-xs sm:text-sm border transition-all duration-300 min-h-[36px] ${
                    isActive
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-sm'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'ALL' ? 'Tous' : ACTOR_STYLE_LABELS[s as keyof typeof ACTOR_STYLE_LABELS]}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Actors Grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {actors.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl text-gray-500">Aucun acteur trouve</p>
            <p className="text-sm mt-2">
              {params.q || params.style
                ? 'Essayez de modifier vos filtres.'
                : 'Les acteurs seront bientot disponibles.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actors.map((actor) => (
              <Link key={actor.id} href={`/actors/${actor.slug}`}>
                <div className="group relative rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-md shadow-sm">
                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6">
                    {/* Avatar + Info */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 to-gray-100 overflow-hidden group-hover:border-[#D4AF37]/40 transition-colors duration-500">
                          {actor.avatarUrl ? (
                            <img
                              src={actor.avatarUrl}
                              alt={actor.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/40 text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                              {actor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {/* Active indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      </div>

                      {/* Name + Nationality */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300 truncate">
                          {actor.name}
                        </h3>
                        {actor.nationality && (
                          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <span>{getNationalityFlag(actor.nationality)}</span>
                            <span>{actor.nationality}</span>
                          </p>
                        )}
                        <div className="mt-2">
                          <Badge
                            className={`text-xs ${
                              STYLE_COLORS[actor.style] || STYLE_COLORS.VERSATILE
                            }`}
                          >
                            {ACTOR_STYLE_LABELS[actor.style as keyof typeof ACTOR_STYLE_LABELS] || actor.style}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    {actor.quote && (
                      <p className="text-sm text-gray-400 italic line-clamp-2 mb-4 pl-4 border-l-2 border-[#D4AF37]/20">
                        &laquo; {actor.quote} &raquo;
                      </p>
                    )}

                    {/* Stats Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Film className="h-3.5 w-3.5" />
                          <span>{actor.filmCount} film{actor.filmCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Heart className="h-3.5 w-3.5" />
                          <span>{formatFollowers(actor.socialFollowers)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#D4AF37]/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
