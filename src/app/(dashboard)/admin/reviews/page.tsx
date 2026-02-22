import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { approveSubmissionAction, rejectSubmissionAction } from '@/app/actions/admin'
import { formatDate, formatPrice } from '@/lib/utils'
import { ClipboardCheck, CheckCircle, XCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Reviews' }

export default async function AdminReviewsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const submissions = await prisma.taskSubmission.findMany({
    where: { status: { in: ['AI_FLAGGED', 'PENDING_AI'] } },
    include: {
      task: {
        include: {
          film: { select: { title: true } },
          phase: { select: { phaseName: true } },
        },
      },
      user: { select: { id: true, displayName: true, email: true, level: true } },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Queue de Review</h1>
        <p className="text-white/50">{submissions.length} soumission{submissions.length > 1 ? 's' : ''} en attente</p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <ClipboardCheck className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl">Aucune review en attente</p>
          <p className="text-sm mt-2">Toutes les soumissions sont à jour.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{sub.task.title}</h3>
                    <Badge variant={sub.status === 'AI_FLAGGED' ? 'warning' : 'secondary'}>
                      {sub.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{sub.task.film.title}</span>
                    <span>·</span>
                    <span>{sub.task.phase.phaseName}</span>
                    <span>·</span>
                    <span>Soumis le {formatDate(sub.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#D4AF37]">{formatPrice(sub.task.priceEuros)}</div>
                  <div className="text-xs text-white/40">par {sub.user.displayName}</div>
                </div>
              </div>

              {/* AI Score */}
              {sub.aiScore !== null && (
                <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">Score IA</span>
                      <div className="text-3xl font-bold text-[#D4AF37]">{sub.aiScore}<span className="text-sm text-white/40">/100</span></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${sub.aiScore >= 70 ? 'bg-green-500' : sub.aiScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${sub.aiScore}%` }}
                        />
                      </div>
                      {sub.aiFeedback && (
                        <p className="text-sm text-white/50 italic">{sub.aiFeedback}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submission content */}
              <div className="p-4 border-b border-white/5">
                {sub.notes && (
                  <div className="mb-3">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Notes du contributeur</p>
                    <p className="text-sm text-white/70">{sub.notes}</p>
                  </div>
                )}
                {sub.fileUrl && (
                  <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#F0D060]">
                    Voir le fichier soumis →
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-3">
                <form action={approveSubmissionAction} className="flex-1">
                  <input type="hidden" name="submissionId" value={sub.id} />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="feedback"
                      placeholder="Commentaire optionnel..."
                      className="flex-1 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-green-500/50"
                    />
                    <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-500 text-white shrink-0">
                      <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                    </Button>
                  </div>
                </form>

                <form action={rejectSubmissionAction}>
                  <input type="hidden" name="submissionId" value={sub.id} />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="feedback"
                      placeholder="Raison du rejet (obligatoire)..."
                      required
                      className="h-9 w-48 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-red-500/50"
                    />
                    <Button type="submit" size="sm" variant="destructive" className="shrink-0">
                      <XCircle className="h-4 w-4 mr-1" /> Rejeter
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
