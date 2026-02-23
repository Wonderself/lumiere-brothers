import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Film, ChevronRight, Star, Users, CheckCircle, Clapperboard } from 'lucide-react'
import { FILM_STATUS_LABELS, CATALOG_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Films en Production — Catalogue Cinema IA',
  description:
    'Decouvrez tous les films en production sur la plateforme Lumiere. Rejoignez l\'equipe, contribuez aux micro-taches et soyez credite au generique.',
  openGraph: {
    title: 'Films en Production — Catalogue Cinema IA | Lumiere',
    description: 'Decouvrez tous les films en production sur la plateforme Lumiere.',
  },
}

async function getFilms(searchParams: { [key: string]: string | undefined }) {
  const { genre, catalog, status } = searchParams
  try {
    return await prisma.film.findMany({
      where: {
        isPublic: true,
        ...(genre ? { genre } : {}),
        ...(catalog ? { catalog: catalog as any } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        _count: { select: { tasks: true, votes: true } },
      },
      orderBy: [{ status: 'asc' }, { progressPct: 'desc' }],
    })
  } catch {
    return []
  }
}

async function getHeroStats() {
  try {
    const [filmsCount, tasksCount, contributorsCount] = await Promise.all([
      prisma.film.count({ where: { isPublic: true } }),
      prisma.task.count(),
      prisma.user.count({ where: { isVerified: true } }),
    ])
    return { filmsCount, tasksCount, contributorsCount }
  } catch {
    return { filmsCount: 0, tasksCount: 0, contributorsCount: 0 }
  }
}

const STATUS_ORDER = ['IN_PRODUCTION', 'PRE_PRODUCTION', 'POST_PRODUCTION', 'RELEASED', 'DRAFT']

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'text-gray-400',
  PRE_PRODUCTION: 'text-yellow-600',
  IN_PRODUCTION: 'text-green-600',
  POST_PRODUCTION: 'text-blue-600',
  RELEASED: 'text-purple-600',
}

export default async function FilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const [films, heroStats] = await Promise.all([getFilms(params), getHeroStats()])

  return (
    <div className="min-h-screen bg-white">
      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Ambient blur circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#D4AF37]/[0.04] rounded-full blur-[100px]" />
          {/* Gold particles */}
          <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-[#D4AF37]/40 animate-pulse" />
          <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-[#D4AF37]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[40%] right-[20%] w-1 h-1 rounded-full bg-[#D4AF37]/30 animate-pulse [animation-delay:1.5s]" />
        </div>

        <div className="relative container mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm mb-6">
            <Clapperboard className="h-4 w-4" />
            <span className="font-medium">Nos Productions</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-gray-900"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Films &{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Productions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Decouvrez nos productions cinematographiques creees collaborativement par notre communaute de co-producteurs
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {[
              { label: 'Films', value: heroStats.filmsCount, icon: Film },
              { label: 'Taches', value: heroStats.tasksCount, icon: CheckCircle },
              { label: 'Contributeurs', value: heroStats.contributorsCount, icon: Users },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sm:p-5 text-center"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mx-auto mb-2">
                  <stat.icon className="h-4 w-4 text-[#D4AF37]" />
                </div>
                <div
                  className="text-2xl sm:text-3xl font-bold text-[#D4AF37]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {stat.value > 0 ? stat.value.toLocaleString('fr-FR') : '--'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade separator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* FILTERS & GRID                                                   */}
      {/* ================================================================ */}
      <div className="px-4 pb-16">
        <div className="container mx-auto max-w-7xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {['Tous', 'IN_PRODUCTION', 'PRE_PRODUCTION', 'POST_PRODUCTION', 'RELEASED'].map((s) => {
              const isActive = (!params.status && s === 'Tous') || params.status === s
              return (
                <Link
                  key={s}
                  href={s === 'Tous' ? '/films' : `/films?status=${s}`}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-sm'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'Tous' ? 'Tous les films' : FILM_STATUS_LABELS[s as keyof typeof FILM_STATUS_LABELS]}
                </Link>
              )
            })}
          </div>

          {/* Films Grid */}
          {films.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Film className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl text-gray-500">Aucun film trouve</p>
              <p className="text-sm mt-2 text-gray-400">Les films seront bientot disponibles.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.slug}`}>
                  <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300 h-full flex flex-col shadow-sm">
                    {/* Cover */}
                    <div className="relative h-52 bg-gradient-to-br from-[#D4AF37]/[0.06] to-gray-100 shrink-0">
                      {film.coverImageUrl ? (
                        <img
                          src={film.coverImageUrl}
                          alt={film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-16 w-16 text-[#D4AF37]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-medium ${STATUS_COLORS[film.status]}`}>
                          &#9679; {FILM_STATUS_LABELS[film.status]}
                        </span>
                      </div>
                      {film.catalog && film.catalog !== 'LUMIERE' && (
                        <div className="absolute top-3 left-3">
                          <span className="text-xs bg-white/90 text-gray-600 rounded px-2 py-0.5 shadow-sm border border-gray-200">
                            {CATALOG_LABELS[film.catalog]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-base mb-2 text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {film.title}
                      </h3>

                      {film.genre && (
                        <span className="text-xs text-gray-400 mb-3">{film.genre}</span>
                      )}

                      {film.description && (
                        <p className="text-xs text-gray-500 mb-4 line-clamp-3 flex-1">{film.description}</p>
                      )}

                      {/* Progress */}
                      <div className="space-y-1.5 mt-auto">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progression</span>
                          <span className="text-[#D4AF37] font-medium">{Math.round(film.progressPct)}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full"
                            style={{ width: `${film.progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{film._count.tasks} taches</span>
                          {film._count.votes > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" /> {film._count.votes}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
