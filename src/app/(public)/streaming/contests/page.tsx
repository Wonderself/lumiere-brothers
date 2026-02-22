import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Trophy, Eye, Clock, Film, ArrowLeft, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function ContestsPage() {
  const contestFilms = await prisma.catalogFilm.findMany({
    where: { isContest: true, status: { in: ['PENDING', 'LIVE'] } },
    orderBy: { viewCount: 'desc' },
    include: { submittedBy: { select: { displayName: true } } },
  })

  const liveFilms = contestFilms.filter(f => f.status === 'LIVE')
  const pendingFilms = contestFilms.filter(f => f.status === 'PENDING')

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/streaming" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#D4AF37]/20 mb-4">
            <Trophy className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Concours Mensuel
          </h1>
          <p className="text-white/50 mt-3 max-w-2xl mx-auto">
            Soumettez votre film et laissez la communauté voter. Le film avec le plus de vues
            à la fin du mois remporte un bonus spécial.
          </p>
        </div>

        {/* Prize Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { position: '1er', prize: '500€ + 1000 tokens', color: '#D4AF37' },
            { position: '2ème', prize: '200€ + 500 tokens', color: '#C0C0C0' },
            { position: '3ème', prize: '100€ + 200 tokens', color: '#CD7F32' },
          ].map((p) => (
            <Card key={p.position} className="bg-white/[0.03] border-white/10 text-center">
              <CardContent className="p-6">
                <Star className="h-8 w-8 mx-auto mb-2" style={{ color: p.color }} />
                <p className="text-white text-xl font-bold">{p.position}</p>
                <p className="text-white/50 text-sm mt-1">{p.prize}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Contest Films */}
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Film className="h-5 w-5 text-[#D4AF37]" /> Films en compétition ({liveFilms.length})
        </h2>

        {liveFilms.length === 0 ? (
          <div className="text-center py-16 mb-12">
            <Film className="h-12 w-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/30">Aucun film en compétition ce mois-ci</p>
            <Link href="/streaming/submit" className="inline-block mt-4 px-6 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors">
              Soumettre le premier
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {liveFilms.map((film, index) => (
              <Link key={film.id} href={`/streaming/${film.slug}`}>
                <Card className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/30 transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-2xl font-bold text-white/20 w-10 text-center">
                      #{index + 1}
                    </div>
                    <div className="h-16 w-24 rounded-lg bg-white/5 overflow-hidden shrink-0">
                      {film.thumbnailUrl ? (
                        <img src={film.thumbnailUrl} alt={film.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Film className="h-6 w-6 text-white/10" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{film.title}</h3>
                      <p className="text-white/40 text-sm">{film.submittedBy.displayName || 'Anonyme'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-semibold flex items-center gap-1">
                        <Eye className="h-4 w-4 text-[#D4AF37]" /> {film.viewCount.toLocaleString()}
                      </p>
                      {film.duration && (
                        <p className="text-white/30 text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {Math.floor(film.duration / 60)}min
                        </p>
                      )}
                    </div>
                    {index === 0 && (
                      <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">Leader</Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pending Films */}
        {pendingFilms.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-white/50 mb-4">En attente d&apos;approbation ({pendingFilms.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60">
              {pendingFilms.map((film) => (
                <Card key={film.id} className="bg-white/[0.02] border-white/5">
                  <CardContent className="p-3">
                    <div className="aspect-video rounded bg-white/5 mb-2 flex items-center justify-center">
                      <Film className="h-6 w-6 text-white/10" />
                    </div>
                    <p className="text-white/40 text-sm truncate">{film.title}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 border-yellow-500/30 text-yellow-500/70">En review</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
