import { CheckCircle, Clock, Circle, Rocket, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'Plan de developpement de la plateforme Lumiere — toutes les phases et fonctionnalites.',
}

type RoadmapItem = {
  id: string
  title: string
  description: string
  status: 'done' | 'in_progress' | 'todo'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

type Phase = {
  id: string
  name: string
  version: string
  description: string
  status: 'done' | 'in_progress' | 'todo'
  items: RoadmapItem[]
}

const roadmap: Phase[] = [
  {
    id: 'v1',
    name: 'Fondations',
    version: 'V1',
    description: 'Infrastructure de base, auth, DB, UI, Admin.',
    status: 'in_progress',
    items: [
      { id: 'v1-1', title: 'Projet Next.js 15 + TypeScript', description: 'Setup complet avec App Router, Tailwind CSS, shadcn/ui', status: 'done', difficulty: 'easy' },
      { id: 'v1-2', title: 'Schema Prisma + PostgreSQL', description: 'Modeles complets : Users, Films, Tasks, Submissions, Payments', status: 'done', difficulty: 'medium' },
      { id: 'v1-3', title: 'Authentification NextAuth.js v5', description: 'Login email/password, middleware de protection des routes', status: 'done', difficulty: 'medium' },
      { id: 'v1-4', title: 'Landing Page', description: 'Hero, stats, films en prod, features, CTA, footer', status: 'done', difficulty: 'medium' },
      { id: 'v1-5', title: 'Catalogue Films', description: 'Liste filtrable, pages detail avec phases et taches', status: 'done', difficulty: 'medium' },
      { id: 'v1-6', title: 'Inscription / Connexion', description: 'Formulaires avec selection de competences, langues, role', status: 'done', difficulty: 'medium' },
      { id: 'v1-7', title: 'Dashboard Contributeur', description: 'Stats perso, taches en cours, recommandations', status: 'done', difficulty: 'medium' },
      { id: 'v1-8', title: 'Marketplace de Taches (basique)', description: 'Liste filtree, detail tache, claim simple', status: 'done', difficulty: 'medium' },
      { id: 'v1-9', title: 'Admin Panel', description: 'CRUD films, taches, users, reviews queue, settings', status: 'done', difficulty: 'hard' },
      { id: 'v1-10', title: 'Page Roadmap', description: 'Cette page !', status: 'done', difficulty: 'easy' },
      { id: 'v1-11', title: 'Script de Seed', description: 'Donnees de demo : admin, 2 films, phases, taches', status: 'done', difficulty: 'easy' },
      { id: 'v1-12', title: 'Docker Compose', description: 'PostgreSQL 16 + Redis 7 pour le dev local', status: 'done', difficulty: 'easy' },
    ],
  },
  {
    id: 'v2',
    name: 'Marketplace & IA',
    version: 'V2',
    description: 'Upload fichiers, validation IA Claude, dependances DAG, emails.',
    status: 'todo',
    items: [
      { id: 'v2-1', title: 'Upload fichiers (tus protocol)', description: 'Upload resumable de fichiers lourds, stockage S3/MinIO', status: 'todo', difficulty: 'hard' },
      { id: 'v2-2', title: 'Validation IA des soumissions', description: 'Integration Claude API, scoring automatique, feedback', status: 'todo', difficulty: 'hard' },
      { id: 'v2-3', title: 'Systeme de dependances (DAG)', description: 'Deverrouillage automatique des taches selon les dependances', status: 'todo', difficulty: 'hard' },
      { id: 'v2-4', title: 'Timer 48h sur les taches', description: 'Auto-release si non soumis dans les delais (BullMQ)', status: 'todo', difficulty: 'medium' },
      { id: 'v2-5', title: 'Taches cascade/danse (video)', description: 'Validation video, extraction keyframes, transcoding HLS', status: 'todo', difficulty: 'expert' },
      { id: 'v2-6', title: 'Generation automatique de taches IA', description: "L'admin entre un synopsis, l'IA decoupe en taches", status: 'todo', difficulty: 'hard' },
      { id: 'v2-7', title: 'Emails transactionnels', description: 'Resend + react-email : bienvenue, validation, paiement...', status: 'todo', difficulty: 'medium' },
      { id: 'v2-8', title: 'Recherche MeiliSearch', description: 'Recherche full-text sur films et taches', status: 'todo', difficulty: 'medium' },
      { id: 'v2-9', title: 'Rate limiting Redis', description: 'Protection API contre les abus', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v3',
    name: 'Paiements & Blockchain',
    version: 'V3',
    description: 'Stripe, Bitcoin Lightning, smart contracts Base L2.',
    status: 'todo',
    items: [
      { id: 'v3-1', title: 'Stripe Connect', description: 'Paiements aux contributeurs via Stripe Transfer', status: 'todo', difficulty: 'hard' },
      { id: 'v3-2', title: 'Bitcoin Lightning (BTCPay)', description: 'Paiement instantane en satoshis via Lightning Network', status: 'todo', difficulty: 'hard' },
      { id: 'v3-3', title: 'Smart Contract ERC-1155 Soulbound', description: 'Co-production avec tokens non-transferables sur Base L2', status: 'todo', difficulty: 'expert' },
      { id: 'v3-4', title: 'Wallet Connect (RainbowKit)', description: 'MetaMask, Coinbase Wallet, WalletConnect', status: 'todo', difficulty: 'hard' },
      { id: 'v3-5', title: 'Page de co-production', description: "Investir dans un film, recevoir des perks et % revenus", status: 'todo', difficulty: 'hard' },
      { id: 'v3-6', title: 'Admin paiements', description: 'Vue globale des paiements, export CSV', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v4',
    name: 'Streaming & Spectateurs',
    version: 'V4',
    description: 'Player HLS, transcoding FFmpeg, abonnements.',
    status: 'todo',
    items: [
      { id: 'v4-1', title: 'Pipeline FFmpeg → HLS', description: 'Transcoding multi-bitrate (360p/720p/1080p/4K)', status: 'todo', difficulty: 'expert' },
      { id: 'v4-2', title: 'Player Video.js', description: 'HLS adaptive, qualite manuelle, sous-titres, PiP', status: 'todo', difficulty: 'hard' },
      { id: 'v4-3', title: 'Espace Spectateur /watch', description: 'Catalogue films released, page film avec player', status: 'todo', difficulty: 'medium' },
      { id: 'v4-4', title: 'Abonnements Stripe', description: 'Plans FREE / BASIC 2€ / PREMIUM 5€', status: 'todo', difficulty: 'hard' },
      { id: 'v4-5', title: 'Sous-titres multi-langues', description: 'Upload .srt/.vtt ou generation Whisper API', status: 'todo', difficulty: 'medium' },
      { id: 'v4-6', title: 'Soumission films externes', description: 'Evaluation IA des films soumis par la communaute', status: 'todo', difficulty: 'hard' },
    ],
  },
  {
    id: 'v5',
    name: 'Gamification & Communaute',
    version: 'V5',
    description: 'Points, niveaux, badges, leaderboard, votes, concours.',
    status: 'todo',
    items: [
      { id: 'v5-1', title: 'Systeme de points & niveaux', description: 'Points par tache, progression ROOKIE→VIP automatique', status: 'todo', difficulty: 'medium' },
      { id: 'v5-2', title: '13 badges & achievements', description: 'Premiere Lumiere, Perfectionniste, Marathonien...', status: 'todo', difficulty: 'medium' },
      { id: 'v5-3', title: 'Leaderboard public', description: 'Top contributeurs global, mensuel, par film', status: 'todo', difficulty: 'medium' },
      { id: 'v5-4', title: 'Profils publics contributeurs', description: 'Portfolio, filmographie, badges, partage social', status: 'todo', difficulty: 'medium' },
      { id: 'v5-5', title: 'Votes communautaires', description: 'Voter pour le prochain film a produire', status: 'todo', difficulty: 'easy' },
      { id: 'v5-6', title: 'Concours automatises', description: 'Concours mensuels avec resultats automatiques', status: 'todo', difficulty: 'hard' },
      { id: 'v5-7', title: 'Systeme de parrainage', description: 'Liens uniques, bonus parrain/filleul', status: 'todo', difficulty: 'medium' },
      { id: 'v5-8', title: 'Images OG dynamiques', description: 'Generation image de partage personnalisee (Vercel OG)', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v6',
    name: 'Soumission Scenarios',
    version: 'V6',
    description: 'Evaluation IA des scenarios, deal de co-production.',
    status: 'todo',
    items: [
      { id: 'v6-1', title: 'Formulaire soumission scenario', description: 'Wizard 4 etapes : infos, upload, tolerance IA, confirmation', status: 'todo', difficulty: 'medium' },
      { id: 'v6-2', title: 'Evaluation IA scenarios', description: 'Score sur 5 criteres, radar chart, feedback', status: 'todo', difficulty: 'hard' },
      { id: 'v6-3', title: 'Negociation interactive', description: 'Slider tolerance IA, diff view des modifications proposees', status: 'todo', difficulty: 'hard' },
      { id: 'v6-4', title: 'Deal automatise', description: 'Contrat, % revenus, credit generique pour scenario accepte', status: 'todo', difficulty: 'medium' },
      { id: 'v6-5', title: 'Admin gestion scenarios', description: 'Review, override score, lancer production', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v7',
    name: 'Polish & Lancement',
    version: 'V7',
    description: 'Securite, SEO, performance, legal, deploiement prod.',
    status: 'todo',
    items: [
      { id: 'v7-1', title: 'Rate limiting Redis (sliding window)', description: 'Protection contre les abus sur toutes les API routes', status: 'todo', difficulty: 'medium' },
      { id: 'v7-2', title: 'Validation Zod complete', description: "Validation cote client ET serveur sur tous les formulaires", status: 'todo', difficulty: 'medium' },
      { id: 'v7-3', title: 'Securite upload', description: 'MIME type reel, taille max, scan antivirus basique', status: 'todo', difficulty: 'hard' },
      { id: 'v7-4', title: 'SEO complet', description: 'Metadata dynamique, sitemap.xml, robots.txt, OG images', status: 'todo', difficulty: 'medium' },
      { id: 'v7-5', title: 'Cache Redis', description: 'ISR sur pages publiques, cache leaderboard/catalogue', status: 'todo', difficulty: 'medium' },
      { id: 'v7-6', title: 'Monitoring Sentry', description: 'Error tracking, alertes, dashboard performance', status: 'todo', difficulty: 'easy' },
      { id: 'v7-7', title: 'Pages legales (RGPD)', description: 'CGU, confidentialite, cookies en FR + EN', status: 'todo', difficulty: 'easy' },
      { id: 'v7-8', title: 'Mode maintenance', description: 'Toggle admin pour afficher une page de maintenance', status: 'todo', difficulty: 'easy' },
      { id: 'v7-9', title: 'Backup DB automatique', description: 'pg_dump quotidien vers S3 via cron job', status: 'todo', difficulty: 'medium' },
      { id: 'v7-10', title: 'Dockerfile + deploy Coolify', description: 'Multi-stage build, docker-compose.prod.yml, README deploy', status: 'todo', difficulty: 'hard' },
    ],
  },
]

const STATUS_CONFIG = {
  done: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 border-green-200', dotColor: 'bg-green-500', label: 'Termine' },
  in_progress: { icon: Clock, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20', dotColor: 'bg-[#D4AF37]', label: 'En cours' },
  todo: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50 border-gray-200', dotColor: 'bg-gray-300', label: 'A faire' },
}

const DIFFICULTY_STARS: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-green-500',
  medium: 'text-yellow-500',
  hard: 'text-orange-500',
  expert: 'text-red-500',
}

function DifficultyStars({ difficulty }: { difficulty: string }) {
  const count = DIFFICULTY_STARS[difficulty] || 1
  const color = DIFFICULTY_COLORS[difficulty] || 'text-gray-400'
  return (
    <span className={`inline-flex items-center gap-0.5 ${color}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current" />
      ))}
    </span>
  )
}

export default function RoadmapPage() {
  const totalItems = roadmap.flatMap((p) => p.items).length
  const doneItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'done').length
  const inProgressItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'in_progress').length

  return (
    <div className="min-h-screen bg-white">
      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Ambient blur circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/3 w-72 h-72 bg-[#D4AF37]/[0.04] rounded-full blur-[100px]" />
          {/* Gold particles */}
          <div className="absolute top-[20%] left-[18%] w-1 h-1 rounded-full bg-[#D4AF37]/40 animate-pulse" />
          <div className="absolute top-[30%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[55%] left-[12%] w-1 h-1 rounded-full bg-[#D4AF37]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[45%] right-[28%] w-1 h-1 rounded-full bg-[#D4AF37]/30 animate-pulse [animation-delay:1.5s]" />
        </div>

        <div className="relative container mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm mb-6">
            <Rocket className="h-4 w-4" />
            <span className="font-medium">Plan de Developpement</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-gray-900"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Roadmap{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Lumiere
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            7 phases pour une plateforme de production cinema IA complete.
          </p>

          {/* Global progress card */}
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div
              className="text-4xl font-bold text-[#D4AF37]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {doneItems} / {totalItems}
            </div>
            <div className="text-gray-500 text-sm">fonctionnalites completees</div>
            <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full"
                style={{ width: `${(doneItems / totalItems) * 100}%` }}
              />
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
              <span className="text-green-500">{doneItems} termines</span>
              <span className="text-[#D4AF37]">{inProgressItems} en cours</span>
              <span>{totalItems - doneItems - inProgressItems} a faire</span>
            </div>
          </div>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* TIMELINE                                                         */}
      {/* ================================================================ */}
      <div className="px-4 pb-16">
        <div className="container mx-auto max-w-5xl">
          {/* Timeline with left rail */}
          <div className="relative">
            {/* Vertical gold timeline rail */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/10 to-transparent hidden md:block" />

            <div className="space-y-16">
              {roadmap.map((phase, phaseIdx) => {
                const phaseConfig = STATUS_CONFIG[phase.status]
                const phaseDone = phase.items.filter((i) => i.status === 'done').length
                const phaseProgress = (phaseDone / phase.items.length) * 100

                return (
                  <div key={phase.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-6 -translate-x-1/2 top-0 hidden md:flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${phaseConfig.dotColor} ring-4 ring-white`} />
                      {phase.status === 'in_progress' && (
                        <div className="absolute w-5 h-5 rounded-full bg-[#D4AF37]/20 animate-ping" />
                      )}
                    </div>

                    {/* Phase content */}
                    <div className="md:ml-16">
                      {/* Phase Header */}
                      <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5 mb-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${phaseConfig.bg} ${phaseConfig.color} shrink-0 w-fit`}>
                            <phaseConfig.icon className="h-4 w-4" />
                            {phase.version} — {phase.name}
                          </div>
                          <div className="flex-1 hidden sm:block">
                            <div className="h-px bg-gray-100" />
                          </div>
                          <span className="text-sm text-gray-400 shrink-0">{phaseDone}/{phase.items.length}</span>
                        </div>

                        <p className="text-gray-500 text-sm mb-4">{phase.description}</p>

                        {/* Phase progress bar */}
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              phase.status === 'done' ? 'bg-green-500' :
                              phase.status === 'in_progress' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0D060]' :
                              'bg-gray-200'
                            }`}
                            style={{ width: `${phaseProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {phase.items.map((item) => {
                          const itemConfig = STATUS_CONFIG[item.status]

                          return (
                            <div
                              key={item.id}
                              className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${itemConfig.bg} shadow-sm`}
                            >
                              <itemConfig.icon className={`h-5 w-5 mt-0.5 shrink-0 ${itemConfig.color}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`text-sm font-medium ${item.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {item.title}
                                  </p>
                                  <DifficultyStars difficulty={item.difficulty} />
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-16 p-6 rounded-2xl border border-gray-100 bg-gray-50 text-center shadow-sm">
            <p className="text-gray-500 text-sm">
              Cette roadmap est mise a jour en continu. Duree totale estimee : 21-27 jours de developpement.
              <br />
              Chemin critique : V1 → V2 → V3 → V7 (13-17 jours pour un MVP monetisable).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
