import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Film, ChevronRight, Star } from 'lucide-react'
import { FILM_STATUS_LABELS, CATALOG_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Catalogue Films',
  description: "Découvrez tous les films en production sur la plateforme Lumière.",
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

const STATUS_ORDER = ['IN_PRODUCTION', 'PRE_PRODUCTION', 'POST_PRODUCTION', 'RELEASED', 'DRAFT']

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'text-gray-400',
  PRE_PRODUCTION: 'text-yellow-400',
  IN_PRODUCTION: 'text-green-400',
  POST_PRODUCTION: 'text-blue-400',
  RELEASED: 'text-purple-400',
}

export default async function FilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const films = await getFilms(params)

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Catalogue Films
          </h1>
          <p className="text-white/50 text-lg">
            {films.length} film{films.length > 1 ? 's' : ''} en production. Rejoignez l'équipe et contribuez.
          </p>
        </div>

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
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                {s === 'Tous' ? 'Tous les films' : FILM_STATUS_LABELS[s as keyof typeof FILM_STATUS_LABELS]}
              </Link>
            )
          })}
        </div>

        {/* Films Grid */}
        {films.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Film className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">Aucun film trouvé</p>
            <p className="text-sm mt-2">Les films seront bientôt disponibles.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {films.map((film) => (
              <Link key={film.id} href={`/films/${film.slug}`}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-[#D4AF37]/20 transition-all duration-300 h-full flex flex-col">
                  {/* Cover */}
                  <div className="relative h-52 bg-gradient-to-br from-[#D4AF37]/10 to-purple-900/20 shrink-0">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-medium ${STATUS_COLORS[film.status]}`}>
                        ● {FILM_STATUS_LABELS[film.status]}
                      </span>
                    </div>
                    {film.catalog && film.catalog !== 'LUMIERE' && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs bg-black/50 text-white/60 rounded px-2 py-0.5">
                          {CATALOG_LABELS[film.catalog]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-base mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {film.title}
                    </h3>

                    {film.genre && (
                      <span className="text-xs text-white/30 mb-3">{film.genre}</span>
                    )}

                    {film.description && (
                      <p className="text-xs text-white/40 mb-4 line-clamp-3 flex-1">{film.description}</p>
                    )}

                    {/* Progress */}
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">Progression</span>
                        <span className="text-[#D4AF37] font-medium">{Math.round(film.progressPct)}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full"
                          style={{ width: `${film.progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>{film._count.tasks} tâches</span>
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
  )
}
