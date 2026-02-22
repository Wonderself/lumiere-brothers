import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShareCard } from '@/components/ui/share-card'
import {
  Film, Award, Star, Coins, Sparkles, Camera,
  Users, Bell, Clapperboard, UserCircle, Palette
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mes Credits & Contributions' }

// Map task types to human-readable French role names
const TASK_TYPE_ROLES: Record<string, string> = {
  PROMPT_WRITING: 'Scenariste IA',
  IMAGE_GEN: 'Directeur Artistique IA',
  VIDEO_REVIEW: 'Superviseur Video',
  STUNT_CAPTURE: 'Cascadeur Motion',
  DANCE_CAPTURE: 'Choreographe Motion',
  DIALOGUE_EDIT: 'Monteur Dialogues',
  COLOR_GRADE: 'Etalonniste',
  SOUND_DESIGN: 'Designer Sonore',
  CONTINUITY_CHECK: 'Script / Continuity',
  QA_REVIEW: 'Quality Assurance',
  CHARACTER_DESIGN: 'Character Designer',
  ENV_DESIGN: 'Environnement Designer',
  MOTION_REF: 'Reference Motion',
  COMPOSITING: 'Compositeur VFX',
  TRANSLATION: 'Traducteur',
  SUBTITLE: 'Sous-titreur',
}

export default async function CreatorCreditsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Fetch all validated task submissions with film details
  const submissions = await prisma.taskSubmission.findMany({
    where: {
      userId: session.user.id,
      status: { in: ['HUMAN_APPROVED', 'AI_APPROVED'] },
    },
    include: {
      task: {
        include: {
          film: {
            select: {
              id: true,
              title: true,
              slug: true,
              genre: true,
              coverImageUrl: true,
              status: true,
            },
          },
          payment: {
            select: { amountEur: true, status: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group submissions by film
  const filmMap = new Map<string, {
    film: typeof submissions[0]['task']['film']
    tasks: typeof submissions
    roles: Set<string>
    totalEarnings: number
    taskCount: number
  }>()

  for (const sub of submissions) {
    const filmId = sub.task.film.id
    if (!filmMap.has(filmId)) {
      filmMap.set(filmId, {
        film: sub.task.film,
        tasks: [],
        roles: new Set(),
        totalEarnings: 0,
        taskCount: 0,
      })
    }
    const entry = filmMap.get(filmId)!
    entry.tasks.push(sub)
    entry.roles.add(sub.task.type)
    entry.taskCount++
    if (sub.task.payment?.status === 'COMPLETED') {
      entry.totalEarnings += sub.task.payment.amountEur
    }
  }

  const filmCredits = Array.from(filmMap.values())
  const totalFilms = filmCredits.length
  const totalTasks = submissions.length
  const totalEarnings = filmCredits.reduce((sum, f) => sum + f.totalEarnings, 0)

  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true, points: true },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Vos Credits & Contributions
        </h1>
        <p className="text-white/40 mt-1">
          Retrouvez tous les films auxquels vous avez contribue et vos credits au generique
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Films credites', value: totalFilms, icon: Film, color: 'text-[#D4AF37]' },
          { label: 'Taches validees', value: totalTasks, icon: Star, color: 'text-blue-400' },
          { label: 'Gains totaux', value: `${totalEarnings.toFixed(0)}EUR`, icon: Coins, color: 'text-green-400' },
          { label: 'Points XP', value: user?.points || 0, icon: Award, color: 'text-purple-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Film credits list */}
      {filmCredits.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-12 text-center">
            <Film className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg">Aucun credit pour le moment</p>
            <p className="text-white/20 text-sm mt-1">
              Completez des taches sur les films pour apparaitre au generique
            </p>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors"
            >
              <Star className="h-4 w-4" /> Decouvrir les taches
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-playfair)]">
            Vos Films
          </h2>
          {filmCredits.map(({ film, roles, totalEarnings: earnings, taskCount }) => {
            const roleList = Array.from(roles)
            const primaryRole = TASK_TYPE_ROLES[roleList[0]] || roleList[0]

            return (
              <Card key={film.id} className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/20 transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Film poster placeholder */}
                    <div className="w-full md:w-48 h-32 md:h-auto shrink-0 bg-gradient-to-br from-[#D4AF37]/30 via-[#1a1a1a] to-[#D4AF37]/10 rounded-t-xl md:rounded-l-xl md:rounded-tr-none flex items-center justify-center">
                      {film.coverImageUrl ? (
                        <img
                          src={film.coverImageUrl}
                          alt={film.title}
                          className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                        />
                      ) : (
                        <Clapperboard className="h-10 w-10 text-[#D4AF37]/40" />
                      )}
                    </div>

                    {/* Film info */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div>
                          <Link
                            href={`/films/${film.slug}`}
                            className="text-white font-bold text-lg hover:text-[#D4AF37] transition-colors"
                          >
                            {film.title}
                          </Link>
                          {film.genre && (
                            <p className="text-white/30 text-sm mt-0.5">{film.genre}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            film.status === 'RELEASED' ? 'success' :
                            film.status === 'IN_PRODUCTION' ? 'warning' : 'secondary'
                          }
                        >
                          {film.status === 'RELEASED' ? 'Sorti' :
                           film.status === 'IN_PRODUCTION' ? 'En production' :
                           film.status === 'POST_PRODUCTION' ? 'Post-prod' :
                           film.status === 'PRE_PRODUCTION' ? 'Pre-prod' : 'Brouillon'}
                        </Badge>
                      </div>

                      {/* Credit badge */}
                      <div className="mb-4">
                        <p className="text-white/40 text-xs mb-1.5">Credite au generique comme :</p>
                        <div className="flex flex-wrap gap-2">
                          {roleList.map((role) => (
                            <Badge
                              key={role}
                              className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1"
                            >
                              <Award className="h-3 w-3 mr-1.5" />
                              {TASK_TYPE_ROLES[role] || role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-white/50">
                          <Star className="h-4 w-4 text-blue-400" />
                          <span>{taskCount} tache{taskCount > 1 ? 's' : ''} validee{taskCount > 1 ? 's' : ''}</span>
                        </div>
                        {earnings > 0 && (
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Coins className="h-4 w-4 text-green-400" />
                            <span>{earnings.toFixed(2)} EUR gagnes</span>
                          </div>
                        )}
                      </div>

                      {/* Share this credit */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-white/30 text-xs mb-2">
                          Partagez que vous etes co-createur du film {film.title} !
                        </p>
                        <ShareCard
                          title={`Je suis co-createur sur Lumiere Brothers !`}
                          description={`J'ai contribue au film "${film.title}" en tant que ${primaryRole}`}
                          url={`https://lumiere-brothers.film/films/${film.slug}`}
                          compact
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* Coming Soon — AI Face Casting */}
      {/* ========================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-[family-name:var(--font-playfair)]">
              Coming Soon — Mettez Votre Visage dans le Film
            </h2>
            <p className="text-white/40 text-sm">
              Devenez litteralement la star du prochain blockbuster IA
            </p>
          </div>
        </div>

        <Card variant="gold">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-white/70 text-sm leading-relaxed max-w-2xl mx-auto">
                Choisissez un personnage, uploadez votre photo, et l&apos;IA vous integre dans le film.
                <br />
                <span className="text-[#D4AF37] font-semibold">
                  Castez vos amis et votre famille dans le prochain blockbuster IA !
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: UserCircle,
                  title: 'Mon Avatar',
                  desc: 'Creez votre personnage IA a partir d\'une simple photo. Apparaissez dans n\'importe quelle scene.',
                  color: 'from-purple-500/20 to-purple-900/10',
                  borderColor: 'border-purple-500/20',
                },
                {
                  icon: Users,
                  title: 'Casting Famille',
                  desc: 'Invitez vos proches a rejoindre le film. Chaque membre de la famille devient un personnage.',
                  color: 'from-blue-500/20 to-blue-900/10',
                  borderColor: 'border-blue-500/20',
                },
                {
                  icon: Palette,
                  title: 'Personnage Custom',
                  desc: 'Designez votre personnage de A a Z : style, vetements, epoque, univers. Totale liberte creative.',
                  color: 'from-[#D4AF37]/20 to-[#D4AF37]/5',
                  borderColor: 'border-[#D4AF37]/20',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`relative rounded-xl bg-gradient-to-b ${card.color} border ${card.borderColor} p-5 text-center`}
                >
                  <Badge className="absolute top-3 right-3 border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px]">
                    Coming 2026 Q3
                  </Badge>
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <card.icon className="h-6 w-6 text-white/60" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                  <p className="text-white/40 text-sm mb-4 leading-relaxed">{card.desc}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 hover:text-white transition-colors border border-white/10"
                  >
                    <Bell className="h-3.5 w-3.5" /> Etre notifie
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================== */}
      {/* Share your credits */}
      {/* ========================================== */}
      {filmCredits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-playfair)]">
            Partagez vos credits
          </h2>

          <ShareCard
            title="Je suis co-createur sur Lumiere Brothers !"
            description={`J'ai contribue a ${totalFilms} film${totalFilms > 1 ? 's' : ''} et complete ${totalTasks} tache${totalTasks > 1 ? 's' : ''}`}
            url="https://lumiere-brothers.film/leaderboard"
          />

          {/* Referral reminder */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
                  <Camera className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    Invitez un ami et gagnez des tokens ensemble
                  </p>
                  <p className="text-white/40 text-sm mt-0.5">
                    Invitez un ami et recevez +30 tokens chacun. Vos filleuls contribuent aux films et vous gagnez des commissions.
                  </p>
                </div>
                <Link
                  href="/collabs/referrals"
                  className="shrink-0 px-4 py-2 bg-[#D4AF37] text-black font-semibold text-sm rounded-lg hover:bg-[#F0D060] transition-colors"
                >
                  Inviter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
