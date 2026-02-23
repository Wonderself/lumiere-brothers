import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Film,
  Heart,
  Award,
  ArrowLeft,
  Star,
  Quote,
  Sparkles,
  Play,
  Users,
  ChevronRight,
} from 'lucide-react'
import { ACTOR_STYLE_LABELS, CAST_ROLE_LABELS, BONUS_TYPE_LABELS } from '@/lib/constants'
import { formatFollowers, getNationalityFlag } from '@/lib/actors'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const actor = await prisma.aIActor.findUnique({ where: { slug } })
  if (!actor) return { title: 'Acteur introuvable' }
  return {
    title: `${actor.name} — Acteur IA Lumiere`,
    description: actor.bio || `Decouvrez ${actor.name}, acteur IA sur la plateforme Lumiere.`,
    openGraph: {
      title: `${actor.name} — Acteur IA Lumiere`,
      description: actor.bio || `Decouvrez ${actor.name}, acteur IA sur la plateforme Lumiere.`,
      images: actor.avatarUrl ? [actor.avatarUrl] : undefined,
    },
  }
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

const ROLE_COLORS: Record<string, string> = {
  LEAD: 'border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]',
  SUPPORTING: 'border-blue-200 bg-blue-50 text-blue-600',
  CAMEO: 'border-purple-200 bg-purple-50 text-purple-600',
  VOICE: 'border-cyan-200 bg-cyan-50 text-cyan-600',
  NARRATOR: 'border-emerald-200 bg-emerald-50 text-emerald-600',
}

export default async function ActorProfilePage({ params }: Props) {
  const { slug } = await params

  const actor = await prisma.aIActor.findUnique({
    where: { slug, isActive: true },
    include: {
      castRoles: {
        include: {
          film: { select: { id: true, title: true, slug: true, coverImageUrl: true, genre: true, status: true } },
          catalogFilm: { select: { id: true, title: true, slug: true, thumbnailUrl: true, genre: true } },
        },
        orderBy: { sortOrder: 'asc' },
      },
      bonusContent: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!actor) notFound()

  // Find similar actors (actors who share films via cast roles)
  const filmIds = actor.castRoles
    .filter((r) => r.filmId)
    .map((r) => r.filmId!)
  const catalogFilmIds = actor.castRoles
    .filter((r) => r.catalogFilmId)
    .map((r) => r.catalogFilmId!)

  let similarActors: any[] = []
  if (filmIds.length > 0 || catalogFilmIds.length > 0) {
    try {
      similarActors = await prisma.aIActor.findMany({
        where: {
          id: { not: actor.id },
          isActive: true,
          castRoles: {
            some: {
              OR: [
                ...(filmIds.length > 0 ? [{ filmId: { in: filmIds } }] : []),
                ...(catalogFilmIds.length > 0 ? [{ catalogFilmId: { in: catalogFilmIds } }] : []),
              ],
            },
          },
        },
        take: 4,
        orderBy: { filmCount: 'desc' },
      })
    } catch {
      similarActors = []
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover */}
      <div className="relative h-64 md:h-80 lg:h-96">
        {actor.coverUrl ? (
          <img
            src={actor.coverUrl}
            alt={`Couverture de ${actor.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/10 via-gray-100 to-gray-50">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-4 md:left-8">
          <Link href="/actors">
            <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white text-gray-700 shadow-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tous les acteurs
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-5 sm:gap-6 mb-8 sm:mb-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 border-white bg-gradient-to-br from-[#D4AF37]/10 to-gray-100 overflow-hidden shadow-lg">
              {actor.avatarUrl ? (
                <img
                  src={actor.avatarUrl}
                  alt={actor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/50 text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {actor.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {actor.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {actor.nationality && (
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span className="text-lg">{getNationalityFlag(actor.nationality)}</span>
                  {actor.nationality}
                </span>
              )}
              <Badge className={STYLE_COLORS[actor.style] || STYLE_COLORS.VERSATILE}>
                {ACTOR_STYLE_LABELS[actor.style as keyof typeof ACTOR_STYLE_LABELS] || actor.style}
              </Badge>
              {actor.debutYear && (
                <span className="text-gray-400 text-sm">Depuis {actor.debutYear}</span>
              )}
            </div>

            {/* Quote */}
            {actor.quote && (
              <div className="flex items-start gap-3 mb-6">
                <Quote className="h-5 w-5 text-[#D4AF37]/40 shrink-0 mt-0.5" />
                <p className="text-[#D4AF37]/80 italic text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {actor.quote}
                </p>
              </div>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { icon: Film, value: actor.filmCount, label: 'films' },
                { icon: Award, value: actor.awardsCount, label: 'prix' },
                { icon: Heart, value: formatFollowers(actor.socialFollowers), label: 'fans' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-[#D4AF37]/60" />
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 pb-16 sm:pb-24">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {actor.bio && (
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                  Biographie
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{actor.bio}</p>
              </section>
            )}

            {/* Filmography */}
            {actor.castRoles.length > 0 && (
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <Film className="h-5 w-5 text-[#D4AF37]" />
                  Filmographie
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {actor.castRoles.map((role) => {
                    const filmData = role.film || role.catalogFilm
                    if (!filmData) return null
                    const filmHref = role.film
                      ? `/films/${role.film.slug}`
                      : `/streaming/${role.catalogFilm!.slug}`
                    const coverImg = role.film?.coverImageUrl || (role.catalogFilm as any)?.thumbnailUrl

                    return (
                      <Link key={role.id} href={filmHref}>
                        <div className="group rounded-xl border border-gray-100 bg-white overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300 shadow-sm">
                          {/* Film Cover */}
                          <div className="relative h-32 bg-gradient-to-br from-[#D4AF37]/[0.04] to-gray-100">
                            {coverImg ? (
                              <img
                                src={coverImg}
                                alt={filmData.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="h-8 w-8 text-[#D4AF37]/20" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-3">
                              <Badge className={`text-[10px] ${ROLE_COLORS[role.role] || ROLE_COLORS.SUPPORTING}`}>
                                {CAST_ROLE_LABELS[role.role as keyof typeof CAST_ROLE_LABELS] || role.role}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-4">
                            <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#D4AF37] transition-colors truncate">
                              {filmData.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {role.characterName}
                            </p>
                            {role.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{role.description}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Bonus Content */}
            {actor.bonusContent.length > 0 && (
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <Play className="h-5 w-5 text-[#D4AF37]" />
                  Contenu Bonus
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {actor.bonusContent.map((bonus) => (
                    <div
                      key={bonus.id}
                      className="rounded-xl border border-gray-100 bg-white p-4 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {bonus.thumbnailUrl ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                            <img
                              src={bonus.thumbnailUrl}
                              alt={bonus.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#D4AF37]/10 to-gray-100 flex items-center justify-center shrink-0">
                            <Play className="h-6 w-6 text-[#D4AF37]/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{bonus.title}</h4>
                          <Badge variant="secondary" className="text-[10px] mt-1 bg-gray-100 text-gray-500 border-gray-200">
                            {BONUS_TYPE_LABELS[bonus.type as keyof typeof BONUS_TYPE_LABELS] || bonus.type}
                          </Badge>
                          {bonus.description && (
                            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{bonus.description}</p>
                          )}
                        </div>
                      </div>
                      {bonus.isPremium && (
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#D4AF37]">
                          <Star className="h-3 w-3" />
                          Contenu Premium
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personality Traits */}
            {actor.personalityTraits.length > 0 && (
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Traits de personnalite
                </h3>
                <div className="flex flex-wrap gap-2">
                  {actor.personalityTraits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] text-[#D4AF37]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Fun Facts */}
            {actor.funFacts.length > 0 && (
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Le saviez-vous ?
                </h3>
                <div className="space-y-3">
                  {actor.funFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="h-3 w-3 text-[#D4AF37]" />
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Details Card */}
            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Fiche technique
              </h3>
              <div className="space-y-3">
                {actor.nationality && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Nationalite</span>
                    <span className="text-gray-700">
                      {getNationalityFlag(actor.nationality)} {actor.nationality}
                    </span>
                  </div>
                )}
                {actor.birthYear && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Naissance</span>
                    <span className="text-gray-700">{actor.birthYear}</span>
                  </div>
                )}
                {actor.debutYear && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Debut</span>
                    <span className="text-gray-700">{actor.debutYear}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Style</span>
                  <span className="text-gray-700">
                    {ACTOR_STYLE_LABELS[actor.style as keyof typeof ACTOR_STYLE_LABELS]}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Films</span>
                  <span className="text-gray-700">{actor.filmCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Prix</span>
                  <span className="text-gray-700">{actor.awardsCount}</span>
                </div>
              </div>
            </section>

            {/* Similar Actors */}
            {similarActors.length > 0 && (
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Acteurs similaires
                </h3>
                <div className="space-y-3">
                  {similarActors.map((sa) => (
                    <Link key={sa.id} href={`/actors/${sa.slug}`}>
                      <div className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 rounded-full border border-gray-200 bg-gradient-to-br from-[#D4AF37]/10 to-gray-100 overflow-hidden shrink-0">
                          {sa.avatarUrl ? (
                            <img
                              src={sa.avatarUrl}
                              alt={sa.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/40 text-sm font-bold">
                              {sa.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#D4AF37] transition-colors">
                            {sa.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {sa.filmCount} film{sa.filmCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
