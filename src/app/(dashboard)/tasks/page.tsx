import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  DIFFICULTY_LABELS,
  PHASE_LABELS,
} from '@/lib/constants'
import { formatPrice, getStatusColor, getDifficultyColor } from '@/lib/utils'
import { Star, Lock, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tâches Disponibles' }

type SearchParams = {
  film?: string
  type?: string
  difficulty?: string
  status?: string
  minPrice?: string
  maxPrice?: string
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const params = await searchParams

  const tasks = await prisma.task.findMany({
    where: {
      ...(params.film ? { filmId: params.film } : {}),
      ...(params.type ? { type: params.type as any } : {}),
      ...(params.difficulty ? { difficulty: params.difficulty as any } : {}),
      status: (params.status as any) || { in: ['AVAILABLE', 'CLAIMED', 'VALIDATED'] },
      ...(params.minPrice ? { priceEuros: { gte: parseFloat(params.minPrice) } } : {}),
      ...(params.maxPrice ? { priceEuros: { lte: parseFloat(params.maxPrice) } } : {}),
    },
    include: {
      film: { select: { id: true, title: true, slug: true } },
      phase: { select: { phaseName: true } },
      claimedBy: { select: { id: true, displayName: true } },
    },
    orderBy: [{ status: 'asc' }, { priceEuros: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  })

  const films = await prisma.film.findMany({
    where: { isPublic: true },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })

  const getDifficultyStars = (difficulty: string) => {
    const count = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 }[difficulty] || 1
    return Array.from({ length: 4 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < count ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/20'}`}
      />
    ))
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Marketplace de Tâches
        </h1>
        <p className="text-white/50">{tasks.length} tâche{tasks.length > 1 ? 's' : ''} trouvée{tasks.length > 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        {/* Film filter */}
        <form method="GET" className="flex flex-wrap gap-3 w-full">
          <select
            name="film"
            defaultValue={params.film || ''}
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
          >
            <option value="">Tous les films</option>
            {films.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>

          <select
            name="difficulty"
            defaultValue={params.difficulty || ''}
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
          >
            <option value="">Toutes difficultés</option>
            <option value="EASY">Facile</option>
            <option value="MEDIUM">Moyen</option>
            <option value="HARD">Difficile</option>
            <option value="EXPERT">Expert</option>
          </select>

          <select
            name="status"
            defaultValue={params.status || ''}
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
          >
            <option value="">Disponibles & En cours</option>
            <option value="AVAILABLE">Disponibles</option>
            <option value="CLAIMED">En cours</option>
            <option value="VALIDATED">Validées</option>
          </select>

          <select
            name="minPrice"
            defaultValue={params.minPrice || ''}
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
          >
            <option value="">Prix min</option>
            <option value="50">50€+</option>
            <option value="100">100€+</option>
            <option value="500">500€</option>
          </select>

          <Button type="submit" variant="outline" size="sm">
            Filtrer
          </Button>

          <Link href="/tasks">
            <Button variant="ghost" size="sm">Réinitialiser</Button>
          </Link>
        </form>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <Star className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl">Aucune tâche trouvée</p>
          <p className="text-sm mt-2">Modifiez vos filtres ou revenez plus tard.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <div className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37]/20 hover:bg-white/[0.04] transition-all duration-200">
                {/* Status indicator */}
                <div className={`w-2 h-12 rounded-full ${
                  task.status === 'AVAILABLE' ? 'bg-green-500' :
                  task.status === 'CLAIMED' ? 'bg-blue-500' :
                  task.status === 'VALIDATED' ? 'bg-[#D4AF37]' :
                  'bg-white/20'
                }`} />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    {task.status === 'LOCKED' && <Lock className="h-4 w-4 text-white/20 mt-0.5 shrink-0" />}
                    <h3 className="font-semibold text-sm group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-white/40">{task.film.title}</span>
                    <span className="text-xs text-white/20">·</span>
                    <span className="text-xs text-white/40">{PHASE_LABELS[task.phase.phaseName]}</span>
                    <Badge variant="secondary" className="text-xs">
                      {TASK_TYPE_LABELS[task.type]}
                    </Badge>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="hidden sm:flex items-center gap-0.5 shrink-0">
                  {getDifficultyStars(task.difficulty)}
                </div>

                {/* Status */}
                <div className="hidden sm:block shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                    {TASK_STATUS_LABELS[task.status]}
                  </span>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-[#D4AF37]">{formatPrice(task.priceEuros)}</div>
                </div>

                <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-[#D4AF37] transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
