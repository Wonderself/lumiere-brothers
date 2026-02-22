import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Play, Eye, Clock, User, Calendar, ArrowLeft, Share2, Heart, Film } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function StreamingFilmPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  const film = await prisma.catalogFilm.findUnique({
    where: { slug },
    include: {
      submittedBy: { select: { displayName: true, avatarUrl: true, bio: true } },
      contract: true,
    },
  })

  if (!film || film.status !== 'LIVE') notFound()

  // Similar films
  const similar = await prisma.catalogFilm.findMany({
    where: { status: 'LIVE', genre: film.genre, id: { not: film.id } },
    take: 5,
    orderBy: { viewCount: 'desc' },
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Video Player Area */}
      <div className="relative bg-black aspect-video max-h-[70vh] w-full">
        {film.videoUrl ? (
          <video
            src={film.videoUrl}
            poster={film.thumbnailUrl || undefined}
            controls
            className="w-full h-full object-contain"
          />
        ) : film.trailerUrl ? (
          <video
            src={film.trailerUrl}
            poster={film.thumbnailUrl || undefined}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Play className="h-20 w-20 text-white/20 mx-auto mb-4" />
              <p className="text-white/30">Vidéo bientôt disponible</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <Link href="/streaming" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {film.genre && <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">{film.genre}</Badge>}
                {film.year && <span className="text-white/30 text-sm">{film.year}</span>}
                {film.language && <span className="text-white/30 text-sm uppercase">{film.language}</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">
                {film.title}
              </h1>
              <div className="flex items-center gap-6 text-white/40 text-sm">
                <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {film.viewCount.toLocaleString()} vues</span>
                {film.duration && (
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {Math.floor(film.duration / 60)} min {film.duration % 60} sec</span>
                )}
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {film.createdAt.toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-lg text-white/60 hover:bg-white/10 transition-colors">
                <Heart className="h-4 w-4" /> J&apos;aime
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-lg text-white/60 hover:bg-white/10 transition-colors">
                <Share2 className="h-4 w-4" /> Partager
              </button>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Synopsis</h2>
              <p className="text-white/60 leading-relaxed">{film.synopsis || 'Aucun synopsis disponible.'}</p>
            </div>

            {/* Tags */}
            {film.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {film.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — Creator Info */}
          <div className="space-y-6">
            <Card className="bg-white/[0.03] border-white/10">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Réalisateur</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{film.submittedBy.displayName || 'Anonyme'}</p>
                    <p className="text-white/30 text-sm">Créateur vérifié</p>
                  </div>
                </div>
                {film.submittedBy.bio && (
                  <p className="text-white/40 text-sm mt-3">{film.submittedBy.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Trailer */}
            {film.trailerUrl && film.videoUrl && (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Bande-annonce</h3>
                  <video src={film.trailerUrl} controls className="w-full rounded-lg" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Similar Films */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">Films similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {similar.map((f) => (
                <Link key={f.id} href={`/streaming/${f.slug}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 relative mb-2">
                    {f.thumbnailUrl ? (
                      <img src={f.thumbnailUrl} alt={f.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Film className="h-8 w-8 text-white/10" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-sm text-white/70 truncate group-hover:text-[#D4AF37] transition-colors">{f.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
