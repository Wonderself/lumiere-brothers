import { CheckCircle, Clock, Circle, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'Plan de développement de la plateforme Lumière — toutes les phases et fonctionnalités.',
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
      { id: 'v1-2', title: 'Schéma Prisma + PostgreSQL', description: 'Modèles complets : Users, Films, Tasks, Submissions, Payments', status: 'done', difficulty: 'medium' },
      { id: 'v1-3', title: 'Authentification NextAuth.js v5', description: 'Login email/password, middleware de protection des routes', status: 'done', difficulty: 'medium' },
      { id: 'v1-4', title: 'Landing Page', description: 'Hero, stats, films en prod, features, CTA, footer', status: 'done', difficulty: 'medium' },
      { id: 'v1-5', title: 'Catalogue Films', description: 'Liste filtrable, pages détail avec phases et tâches', status: 'done', difficulty: 'medium' },
      { id: 'v1-6', title: 'Inscription / Connexion', description: 'Formulaires avec sélection de compétences, langues, rôle', status: 'done', difficulty: 'medium' },
      { id: 'v1-7', title: 'Dashboard Contributeur', description: 'Stats perso, tâches en cours, recommandations', status: 'done', difficulty: 'medium' },
      { id: 'v1-8', title: 'Marketplace de Tâches (basique)', description: 'Liste filtrée, détail tâche, claim simple', status: 'done', difficulty: 'medium' },
      { id: 'v1-9', title: 'Admin Panel', description: 'CRUD films, tâches, users, reviews queue, settings', status: 'done', difficulty: 'hard' },
      { id: 'v1-10', title: 'Page Roadmap', description: 'Cette page !', status: 'done', difficulty: 'easy' },
      { id: 'v1-11', title: 'Script de Seed', description: 'Données de démo : admin, 2 films, phases, tâches', status: 'done', difficulty: 'easy' },
      { id: 'v1-12', title: 'Docker Compose', description: 'PostgreSQL 16 + Redis 7 pour le dev local', status: 'done', difficulty: 'easy' },
    ],
  },
  {
    id: 'v2',
    name: 'Marketplace & IA',
    version: 'V2',
    description: 'Upload fichiers, validation IA Claude, dépendances DAG, emails.',
    status: 'todo',
    items: [
      { id: 'v2-1', title: 'Upload fichiers (tus protocol)', description: 'Upload resumable de fichiers lourds, stockage S3/MinIO', status: 'todo', difficulty: 'hard' },
      { id: 'v2-2', title: 'Validation IA des soumissions', description: 'Intégration Claude API, scoring automatique, feedback', status: 'todo', difficulty: 'hard' },
      { id: 'v2-3', title: 'Système de dépendances (DAG)', description: 'Déverrouillage automatique des tâches selon les dépendances', status: 'todo', difficulty: 'hard' },
      { id: 'v2-4', title: 'Timer 48h sur les tâches', description: 'Auto-release si non soumis dans les délais (BullMQ)', status: 'todo', difficulty: 'medium' },
      { id: 'v2-5', title: 'Tâches cascade/danse (vidéo)', description: 'Validation vidéo, extraction keyframes, transcoding HLS', status: 'todo', difficulty: 'expert' },
      { id: 'v2-6', title: 'Génération automatique de tâches IA', description: "L'admin entre un synopsis, l'IA découpe en tâches", status: 'todo', difficulty: 'hard' },
      { id: 'v2-7', title: 'Emails transactionnels', description: 'Resend + react-email : bienvenue, validation, paiement...', status: 'todo', difficulty: 'medium' },
      { id: 'v2-8', title: 'Recherche MeiliSearch', description: 'Recherche full-text sur films et tâches', status: 'todo', difficulty: 'medium' },
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
      { id: 'v3-2', title: 'Bitcoin Lightning (BTCPay)', description: 'Paiement instantané en satoshis via Lightning Network', status: 'todo', difficulty: 'hard' },
      { id: 'v3-3', title: 'Smart Contract ERC-1155 Soulbound', description: 'Co-production avec tokens non-transférables sur Base L2', status: 'todo', difficulty: 'expert' },
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
      { id: 'v4-2', title: 'Player Video.js', description: 'HLS adaptive, qualité manuelle, sous-titres, PiP', status: 'todo', difficulty: 'hard' },
      { id: 'v4-3', title: 'Espace Spectateur /watch', description: 'Catalogue films released, page film avec player', status: 'todo', difficulty: 'medium' },
      { id: 'v4-4', title: 'Abonnements Stripe', description: 'Plans FREE / BASIC 2€ / PREMIUM 5€', status: 'todo', difficulty: 'hard' },
      { id: 'v4-5', title: 'Sous-titres multi-langues', description: 'Upload .srt/.vtt ou génération Whisper API', status: 'todo', difficulty: 'medium' },
      { id: 'v4-6', title: 'Soumission films externes', description: 'Évaluation IA des films soumis par la communauté', status: 'todo', difficulty: 'hard' },
    ],
  },
  {
    id: 'v5',
    name: 'Gamification & Communauté',
    version: 'V5',
    description: 'Points, niveaux, badges, leaderboard, votes, concours.',
    status: 'todo',
    items: [
      { id: 'v5-1', title: 'Système de points & niveaux', description: 'Points par tâche, progression ROOKIE→VIP automatique', status: 'todo', difficulty: 'medium' },
      { id: 'v5-2', title: '13 badges & achievements', description: 'Première Lumière, Perfectionniste, Marathonien...', status: 'todo', difficulty: 'medium' },
      { id: 'v5-3', title: 'Leaderboard public', description: 'Top contributeurs global, mensuel, par film', status: 'todo', difficulty: 'medium' },
      { id: 'v5-4', title: 'Profils publics contributeurs', description: 'Portfolio, filmographie, badges, partage social', status: 'todo', difficulty: 'medium' },
      { id: 'v5-5', title: 'Votes communautaires', description: 'Voter pour le prochain film à produire', status: 'todo', difficulty: 'easy' },
      { id: 'v5-6', title: 'Concours automatisés', description: 'Concours mensuels avec résultats automatiques', status: 'todo', difficulty: 'hard' },
      { id: 'v5-7', title: 'Système de parrainage', description: 'Liens uniques, bonus parrain/filleul', status: 'todo', difficulty: 'medium' },
      { id: 'v5-8', title: 'Images OG dynamiques', description: 'Génération image de partage personnalisée (Vercel OG)', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v6',
    name: 'Soumission Scénarios',
    version: 'V6',
    description: 'Évaluation IA des scénarios, deal de co-production.',
    status: 'todo',
    items: [
      { id: 'v6-1', title: 'Formulaire soumission scénario', description: 'Wizard 4 étapes : infos, upload, tolérance IA, confirmation', status: 'todo', difficulty: 'medium' },
      { id: 'v6-2', title: 'Évaluation IA scénarios', description: 'Score sur 5 critères, radar chart, feedback', status: 'todo', difficulty: 'hard' },
      { id: 'v6-3', title: 'Négociation interactive', description: 'Slider tolérance IA, diff view des modifications proposées', status: 'todo', difficulty: 'hard' },
      { id: 'v6-4', title: 'Deal automatisé', description: 'Contrat, % revenus, crédit générique pour scénario accepté', status: 'todo', difficulty: 'medium' },
      { id: 'v6-5', title: 'Admin gestion scénarios', description: 'Review, override score, lancer production', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v7',
    name: 'Polish & Lancement',
    version: 'V7',
    description: 'Sécurité, SEO, performance, légal, déploiement prod.',
    status: 'todo',
    items: [
      { id: 'v7-1', title: 'Rate limiting Redis (sliding window)', description: 'Protection contre les abus sur toutes les API routes', status: 'todo', difficulty: 'medium' },
      { id: 'v7-2', title: 'Validation Zod complète', description: "Validation côté client ET serveur sur tous les formulaires", status: 'todo', difficulty: 'medium' },
      { id: 'v7-3', title: 'Sécurité upload', description: 'MIME type réel, taille max, scan antivirus basique', status: 'todo', difficulty: 'hard' },
      { id: 'v7-4', title: 'SEO complet', description: 'Metadata dynamique, sitemap.xml, robots.txt, OG images', status: 'todo', difficulty: 'medium' },
      { id: 'v7-5', title: 'Cache Redis', description: 'ISR sur pages publiques, cache leaderboard/catalogue', status: 'todo', difficulty: 'medium' },
      { id: 'v7-6', title: 'Monitoring Sentry', description: 'Error tracking, alertes, dashboard performance', status: 'todo', difficulty: 'easy' },
      { id: 'v7-7', title: 'Pages légales (RGPD)', description: 'CGU, confidentialité, cookies en FR + EN', status: 'todo', difficulty: 'easy' },
      { id: 'v7-8', title: 'Mode maintenance', description: 'Toggle admin pour afficher une page de maintenance', status: 'todo', difficulty: 'easy' },
      { id: 'v7-9', title: 'Backup DB automatique', description: 'pg_dump quotidien vers S3 via cron job', status: 'todo', difficulty: 'medium' },
      { id: 'v7-10', title: 'Dockerfile + deploy Coolify', description: 'Multi-stage build, docker-compose.prod.yml, README deploy', status: 'todo', difficulty: 'hard' },
    ],
  },
]

const STATUS_CONFIG = {
  done: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Terminé' },
  in_progress: { icon: Clock, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20', label: 'En cours' },
  todo: { icon: Circle, color: 'text-white/30', bg: 'bg-white/5 border-white/10', label: 'À faire' },
}

const DIFFICULTY_CONFIG = {
  easy: { label: '⭐', color: 'text-green-400' },
  medium: { label: '⭐⭐', color: 'text-yellow-400' },
  hard: { label: '⭐⭐⭐', color: 'text-orange-400' },
  expert: { label: '⭐⭐⭐⭐', color: 'text-red-400' },
}

export default function RoadmapPage() {
  const totalItems = roadmap.flatMap((p) => p.items).length
  const doneItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'done').length
  const inProgressItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'in_progress').length

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Roadmap Lumière
          </h1>
          <p className="text-white/50 text-lg mb-8">
            Plan de développement complet — 7 phases pour une plateforme de production cinéma IA complète.
          </p>

          {/* Global progress */}
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="text-4xl font-bold text-[#D4AF37]">{doneItems} / {totalItems}</div>
            <div className="text-white/50 text-sm">fonctionnalités complétées</div>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full"
                style={{ width: `${(doneItems / totalItems) * 100}%` }}
              />
            </div>
            <div className="flex gap-6 text-xs text-white/40">
              <span className="text-green-400">{doneItems} terminés</span>
              <span className="text-[#D4AF37]">{inProgressItems} en cours</span>
              <span>{totalItems - doneItems - inProgressItems} à faire</span>
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-12">
          {roadmap.map((phase) => {
            const phaseConfig = STATUS_CONFIG[phase.status]
            const phaseDone = phase.items.filter((i) => i.status === 'done').length
            const phaseProgress = (phaseDone / phase.items.length) * 100

            return (
              <div key={phase.id}>
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${phaseConfig.bg} ${phaseConfig.color}`}>
                    <phaseConfig.icon className="h-4 w-4" />
                    {phase.version} — {phase.name}
                  </div>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-sm text-white/30">{phaseDone}/{phase.items.length}</span>
                </div>

                <p className="text-white/40 text-sm mb-4 ml-1">{phase.description}</p>

                {/* Phase progress bar */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      phase.status === 'done' ? 'bg-green-500' :
                      phase.status === 'in_progress' ? 'bg-[#D4AF37]' :
                      'bg-white/10'
                    }`}
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>

                {/* Items */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {phase.items.map((item) => {
                    const itemConfig = STATUS_CONFIG[item.status]
                    const diffConfig = DIFFICULTY_CONFIG[item.difficulty]

                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${itemConfig.bg}`}
                      >
                        <itemConfig.icon className={`h-5 w-5 mt-0.5 shrink-0 ${itemConfig.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-medium ${item.status === 'done' ? 'text-white/60 line-through' : 'text-white'}`}>
                              {item.title}
                            </p>
                            <span className={`text-xs shrink-0 ${diffConfig.color}`}>{diffConfig.label}</span>
                          </div>
                          <p className="text-xs text-white/30 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
          <p className="text-white/40 text-sm">
            Cette roadmap est mise à jour en continu. Durée totale estimée : 21-27 jours de développement.
            <br />
            Chemin critique : V1 → V2 → V3 → V7 (13-17 jours pour un MVP monétisable).
          </p>
        </div>
      </div>
    </div>
  )
}
