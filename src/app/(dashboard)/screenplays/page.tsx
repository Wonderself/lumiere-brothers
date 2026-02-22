import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mes Scenarios' }

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning'; className?: string }
> = {
  SUBMITTED: { label: 'Soumis', variant: 'secondary', className: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  EVALUATING: { label: 'En evaluation', variant: 'warning' },
  ACCEPTED: { label: 'Accepte', variant: 'success' },
  REJECTED: { label: 'Refuse', variant: 'destructive' },
}

const GENRE_COLORS: Record<string, string> = {
  Drame: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  Comedie: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  Thriller: 'border-red-500/30 bg-red-500/10 text-red-400',
  'Sci-Fi': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  Horreur: 'border-red-700/30 bg-red-700/10 text-red-500',
  Animation: 'border-green-500/30 bg-green-500/10 text-green-400',
  Documentaire: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  Action: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  Romance: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  Fantastique: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
}

export default async function ScreenplaysPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const screenplays = await prisma.screenplay.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Mes Scenarios
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {screenplays.length} scenario{screenplays.length !== 1 ? 's' : ''} soumis
          </p>
        </div>
        <Link href="/screenplays/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Soumettre un scenario
          </Button>
        </Link>
      </div>

      {/* Screenplays Grid */}
      {screenplays.length === 0 ? (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-white/15 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-2">Aucun scenario soumis</p>
            <p className="text-white/25 text-sm mb-6">
              Soumettez votre premier scenario et laissez notre IA l&#39;evaluer
            </p>
            <Link href="/screenplays/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Soumettre un scenario
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {screenplays.map((screenplay) => {
            const statusConfig = STATUS_CONFIG[screenplay.status] || STATUS_CONFIG.SUBMITTED
            return (
              <Card key={screenplay.id} variant="glass" className="hover:border-[#D4AF37]/20 transition-all">
                <CardContent className="p-6">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-white truncate">
                      {screenplay.title}
                    </h3>
                    <Badge
                      variant={statusConfig.variant}
                      className={statusConfig.className || ''}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Genre */}
                  {screenplay.genre && (
                    <div className="mb-3">
                      <Badge
                        variant="outline"
                        className={GENRE_COLORS[screenplay.genre] || ''}
                      >
                        {screenplay.genre}
                      </Badge>
                    </div>
                  )}

                  {/* Logline */}
                  {screenplay.logline && (
                    <p className="text-sm text-white/40 line-clamp-2 mb-4">
                      {screenplay.logline}
                    </p>
                  )}

                  {/* AI Score */}
                  {screenplay.aiScore !== null && screenplay.aiScore !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                          <span className="text-xs text-white/50">Score IA</span>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            screenplay.aiScore >= 80
                              ? 'text-green-400'
                              : screenplay.aiScore >= 65
                              ? 'text-yellow-400'
                              : screenplay.aiScore >= 50
                              ? 'text-orange-400'
                              : 'text-red-400'
                          }`}
                        >
                          {screenplay.aiScore}/100
                        </span>
                      </div>
                      <Progress value={screenplay.aiScore} />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-white/25">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {formatDate(screenplay.createdAt)}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Tolerance IA: {screenplay.modificationTolerance}%</span>
                      {screenplay.revenueShareBps > 0 && (
                        <span>Rev: {(screenplay.revenueShareBps / 100).toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
