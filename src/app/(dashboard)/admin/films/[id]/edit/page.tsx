import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateFilmAction } from '@/app/actions/admin'
import { GENRES, CATALOG_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Admin — Éditer Film' }

const FILM_STATUSES = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PRE_PRODUCTION', label: 'Pré-Production' },
  { value: 'IN_PRODUCTION', label: 'En Production' },
  { value: 'POST_PRODUCTION', label: 'Post-Production' },
  { value: 'RELEASED', label: 'Sorti' },
  { value: 'ARCHIVED', label: 'Archivé' },
]

export default async function EditFilmPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const film = await prisma.film.findUnique({
    where: { id },
    include: {
      phases: { orderBy: { phaseOrder: 'asc' } },
      _count: { select: { tasks: true } },
    },
  })

  if (!film) notFound()

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
            Éditer Film
          </h1>
          <p className="text-white/50">{film.title}</p>
        </div>
        <Link href="/admin/films">
          <Button variant="outline">← Retour</Button>
        </Link>
      </div>

      <form action={updateFilmAction} className="space-y-6">
        <input type="hidden" name="id" value={film.id} />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" name="title" required defaultValue={film.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              name="status"
              defaultValue={film.status}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              {FILM_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <select
              id="genre"
              name="genre"
              defaultValue={film.genre || ''}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              <option value="">Sélectionner un genre</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="catalog">Catalogue</Label>
            <select
              id="catalog"
              name="catalog"
              defaultValue={film.catalog}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              {Object.entries(CATALOG_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Budget Estimé (€)</Label>
            <Input
              id="estimatedBudget"
              name="estimatedBudget"
              type="number"
              defaultValue={film.estimatedBudget?.toString() || ''}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description courte</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={film.description || ''}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-vertical"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="synopsis">Synopsis complet</Label>
          <textarea
            id="synopsis"
            name="synopsis"
            rows={5}
            defaultValue={film.synopsis || ''}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-vertical"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImageUrl">URL Image de Couverture</Label>
          <Input
            id="coverImageUrl"
            name="coverImageUrl"
            type="url"
            placeholder="https://..."
            defaultValue={film.coverImageUrl || ''}
          />
          {film.coverImageUrl && (
            <img
              src={film.coverImageUrl}
              alt="Aperçu"
              className="mt-2 h-32 w-48 object-cover rounded-lg border border-white/10"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            value="true"
            defaultChecked={film.isPublic}
            className="rounded"
          />
          <Label htmlFor="isPublic">Film public (visible dans le catalogue)</Label>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <p className="text-xs text-white/40 mb-3">Statistiques</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-[#D4AF37]">{Math.round(film.progressPct)}%</div>
              <div className="text-xs text-white/30">Progression</div>
            </div>
            <div>
              <div className="text-xl font-bold">{film._count.tasks}</div>
              <div className="text-xs text-white/30">Tâches</div>
            </div>
            <div>
              <div className="text-xl font-bold">{film.phases.length}</div>
              <div className="text-xs text-white/30">Phases</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg">Enregistrer les modifications</Button>
          <Link href="/admin/films">
            <Button type="button" variant="outline" size="lg">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
