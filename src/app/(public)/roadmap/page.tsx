import { CheckCircle, Clock, Circle, ChevronRight, Rocket, Sparkles, Zap, PartyPopper, Star } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roadmap — Lumière Creators',
  description: 'Plan de développement de Lumière Creators — outils IA, micro-tâches guidées, marketplace. Chaque étape est concrète et réaliste.',
}

type RoadmapItem = {
  id: string
  title: string
  description: string
  status: 'done' | 'in_progress' | 'todo'
  difficulty: 'trivial' | 'easy' | 'medium' | 'guided'
  note?: string
}

type Phase = {
  id: string
  name: string
  version: string
  description: string
  status: 'done' | 'in_progress' | 'todo'
  emoji: string
  items: RoadmapItem[]
}

const roadmap: Phase[] = [
  {
    id: 'v1',
    name: 'Fondations',
    version: 'V1',
    description: 'Infrastructure, authentification, UI complète, panel admin, marketplace de base. Le socle est prêt.',
    status: 'done',
    emoji: '🏗️',
    items: [
      { id: 'v1-1', title: 'Next.js 16 + TypeScript + Tailwind', description: 'App Router, design system light, composants UI modernes', status: 'done', difficulty: 'trivial' },
      { id: 'v1-2', title: 'Base de données PostgreSQL + Prisma 7', description: 'Users, Tasks, Submissions, Payments, Films, Analytics', status: 'done', difficulty: 'easy' },
      { id: 'v1-3', title: 'Authentification NextAuth v5', description: 'Login/register, JWT, rôles créateur/client/admin', status: 'done', difficulty: 'easy' },
      { id: 'v1-4', title: 'Landing Page créateurs', description: 'Hero, 3 piliers, outils, marketplace, collaboration, CTA', status: 'done', difficulty: 'easy' },
      { id: 'v1-5', title: 'Marketplace micro-tâches', description: '5 catégories, filtres, détail tâche, claim, soumission', status: 'done', difficulty: 'easy' },
      { id: 'v1-6', title: 'Dashboard contributeur', description: 'Stats, tâches en cours, revenus, recommandations', status: 'done', difficulty: 'easy' },
      { id: 'v1-7', title: 'Panel Admin complet', description: 'CRUD tâches/users, queue de review, settings, analytics', status: 'done', difficulty: 'medium' },
      { id: 'v1-8', title: 'Pages publiques', description: 'À propos, roadmap, leaderboard, legal, streaming', status: 'done', difficulty: 'easy' },
      { id: 'v1-9', title: 'Docker + Seed + Dev tools', description: 'PostgreSQL, Redis, données de démo, Prisma Studio', status: 'done', difficulty: 'trivial' },
    ],
  },
  {
    id: 'v2',
    name: 'Briefs IA & Guidage',
    version: 'V2',
    description: 'Chaque tâche devient ultra-guidée : brief détaillé, étapes numérotées, exemples visuels, outils recommandés.',
    status: 'in_progress',
    emoji: '🧭',
    items: [
      { id: 'v2-1', title: 'Briefs détaillés par tâche', description: 'Chaque micro-tâche a un brief pro : contexte, objectif, livrables attendus', status: 'in_progress', difficulty: 'easy', note: 'Template réutilisable' },
      { id: 'v2-2', title: 'Étapes guidées numérotées', description: 'Chaque tâche découpée en 3-7 étapes claires, avec captures d\'écran', status: 'todo', difficulty: 'easy' },
      { id: 'v2-3', title: 'Outils IA recommandés', description: 'Suggestions d\'outils par catégorie : Midjourney, Runway, ElevenLabs...', status: 'todo', difficulty: 'trivial' },
      { id: 'v2-4', title: 'Exemples visuels (avant/après)', description: 'Galerie d\'exemples de livrables validés pour chaque type de tâche', status: 'todo', difficulty: 'easy' },
      { id: 'v2-5', title: 'Niveaux de difficulté', description: 'Débutant / Intermédiaire / Expert — filtrage et recommandation', status: 'todo', difficulty: 'trivial' },
      { id: 'v2-6', title: 'Validation IA des soumissions', description: 'Claude analyse le livrable, feedback constructif, score qualité', status: 'todo', difficulty: 'medium', note: 'API Claude intégrée' },
    ],
  },
  {
    id: 'v3',
    name: 'Outils Créateurs',
    version: 'V3',
    description: 'Suite d\'outils IA pour les créateurs : génération, planning, analytics, collaboration.',
    status: 'todo',
    emoji: '🛠️',
    items: [
      { id: 'v3-1', title: 'Studio de génération vidéo', description: 'Interface simple pour générer des vidéos IA avec prompts guidés', status: 'todo', difficulty: 'medium' },
      { id: 'v3-2', title: 'Éditeur de thumbnails', description: 'Création rapide de miniatures avec templates et IA', status: 'todo', difficulty: 'easy' },
      { id: 'v3-3', title: 'Planning de contenu', description: 'Calendrier éditorial avec suggestions IA et rappels', status: 'todo', difficulty: 'easy' },
      { id: 'v3-4', title: 'Analytics créateur', description: 'Revenus, performances, progression, comparaison mensuelle', status: 'todo', difficulty: 'easy' },
      { id: 'v3-5', title: 'Brief IA personnalisé', description: 'L\'IA génère un brief adapté au profil et aux compétences du créateur', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v4',
    name: 'Paiements & Revenus',
    version: 'V4',
    description: 'Les créateurs sont payés. Stripe, factures, transparence totale.',
    status: 'todo',
    emoji: '💰',
    items: [
      { id: 'v4-1', title: 'Stripe Connect', description: 'Paiement automatique après validation de chaque tâche', status: 'todo', difficulty: 'medium', note: 'Guide Stripe pas à pas' },
      { id: 'v4-2', title: 'Dashboard revenus', description: 'Historique des gains, solde disponible, demande de retrait', status: 'todo', difficulty: 'easy' },
      { id: 'v4-3', title: 'Facturation automatique', description: 'Factures PDF générées pour chaque paiement reçu', status: 'todo', difficulty: 'easy' },
      { id: 'v4-4', title: 'Plans clients premium', description: 'Abonnements pour clients : accès prioritaire, support dédié', status: 'todo', difficulty: 'medium', note: 'Réutilise Stripe' },
    ],
  },
  {
    id: 'v5',
    name: 'Collaboration & Communauté',
    version: 'V5',
    description: 'Marketplace de collabs, profils publics, concours, gamification.',
    status: 'todo',
    emoji: '🤝',
    items: [
      { id: 'v5-1', title: 'Marketplace de collaborations', description: 'Poster des projets, trouver des créateurs, proposer des collabs', status: 'todo', difficulty: 'medium' },
      { id: 'v5-2', title: 'Profils publics créateurs', description: 'Portfolio, compétences, badges, avis clients, contact', status: 'todo', difficulty: 'easy' },
      { id: 'v5-3', title: 'Points & niveaux', description: 'ROOKIE → PRO → EXPERT → VIP, progression automatique', status: 'todo', difficulty: 'easy' },
      { id: 'v5-4', title: 'Badges & achievements', description: '13 badges de reconnaissance : Premier Livrable, Marathonien...', status: 'todo', difficulty: 'easy' },
      { id: 'v5-5', title: 'Concours mensuels', description: 'Thèmes créatifs, votes communauté, prix en cash', status: 'todo', difficulty: 'medium' },
      { id: 'v5-6', title: 'Parrainage', description: 'Invitez des créateurs, bonus parrain et filleul', status: 'todo', difficulty: 'easy' },
    ],
  },
  {
    id: 'v6',
    name: 'Clients & Commandes',
    version: 'V6',
    description: 'Les clients commandent des services IA. Formulaires, suivi, livraison, satisfaction.',
    status: 'todo',
    emoji: '🛒',
    items: [
      { id: 'v6-1', title: 'Formulaire de commande guidé', description: 'Le client décrit son besoin → l\'IA découpe en micro-tâches', status: 'todo', difficulty: 'medium' },
      { id: 'v6-2', title: 'Suivi de commande en temps réel', description: 'Progression, étapes, prévisualisation, messagerie', status: 'todo', difficulty: 'easy' },
      { id: 'v6-3', title: 'Système d\'avis et notation', description: '5 étoiles + commentaire après livraison', status: 'todo', difficulty: 'easy' },
      { id: 'v6-4', title: 'Matching IA créateur-client', description: 'Recommandation du meilleur créateur pour chaque commande', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v7',
    name: 'Lancement Production',
    version: 'V7',
    description: 'Sécurité, SEO, performance, déploiement. La plateforme est live.',
    status: 'todo',
    emoji: '🚀',
    items: [
      { id: 'v7-1', title: 'Déploiement Vercel', description: 'HTTPS automatique, CDN mondial, preview branches', status: 'todo', difficulty: 'trivial', note: '3 clics + guide' },
      { id: 'v7-2', title: 'SEO complet', description: 'Metadata, sitemap, robots.txt, JSON-LD, Open Graph', status: 'todo', difficulty: 'easy' },
      { id: 'v7-3', title: 'Performance & cache', description: 'Redis ISR, images optimisées, Lighthouse 90+', status: 'todo', difficulty: 'easy' },
      { id: 'v7-4', title: 'Sécurité', description: 'Rate limiting, validation Zod, CSP headers', status: 'todo', difficulty: 'medium' },
      { id: 'v7-5', title: 'Monitoring', description: 'Sentry error tracking, alertes temps réel', status: 'todo', difficulty: 'trivial', note: 'SDK en 2 lignes' },
      { id: 'v7-6', title: 'Pages légales RGPD', description: 'CGU, confidentialité, cookies — FR + EN', status: 'todo', difficulty: 'trivial' },
      { id: 'v7-7', title: 'DNS & domaine', description: 'creators.lumiere.film configuré', status: 'todo', difficulty: 'easy', note: 'Guide fourni' },
    ],
  },
]

const STATUS_CONFIG = {
  done: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 border-green-200', dotColor: 'bg-green-500', label: 'Terminé' },
  in_progress: { icon: Clock, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20', dotColor: 'bg-[#D4AF37]', label: 'En cours' },
  todo: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50 border-gray-200', dotColor: 'bg-gray-300', label: 'À faire' },
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; text: string }> = {
  trivial: { label: 'Très facile', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', text: '⚡' },
  easy: { label: 'Facile', color: 'bg-green-50 text-green-600 border-green-200', text: '✓' },
  medium: { label: 'Moyen', color: 'bg-amber-50 text-amber-600 border-amber-200', text: '⭐' },
  guided: { label: 'Guidé', color: 'bg-blue-50 text-blue-600 border-blue-200', text: '📘' },
}

export default function RoadmapPage() {
  const totalItems = roadmap.flatMap((p) => p.items).length
  const doneItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'done').length
  const inProgressItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'in_progress').length
  const progressPercent = Math.round((doneItems / totalItems) * 100)

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/3 w-72 h-72 bg-purple-100/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Plan de Développement
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-[#1A1A2E]"
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
              Creators
            </span>
          </h1>

          <p className="text-[#4A4A68] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            7 phases pour la plateforme de micro-tâches IA la plus accessible au monde.
            Chaque étape est concrète, réaliste, et pensée pour les créateurs.
          </p>

          {/* Progress card */}
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-[#E5E5E0] bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className="text-4xl font-bold text-[#D4AF37]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {progressPercent}%
              </div>
              <div className="text-left">
                <div className="text-sm text-[#4A4A68]">{doneItems} / {totalItems} complétés</div>
                <div className="text-xs text-[#8E8EA0]">Phase {roadmap.findIndex(p => p.status === 'in_progress') + 1} en cours</div>
              </div>
            </div>
            <div className="w-72 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex gap-6 text-xs text-[#8E8EA0]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> {doneItems} terminés</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> {inProgressItems} en cours</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> {totalItems - doneItems - inProgressItems} à venir</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E5E5E0] to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* TIMELINE                                                         */}
      {/* ================================================================ */}
      <div className="px-4 pb-16">
        <div className="container mx-auto max-w-5xl">
          <div className="relative">
            {/* Vertical timeline rail */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/10 to-transparent hidden md:block" />

            <div className="space-y-16">
              {roadmap.map((phase) => {
                const phaseConfig = STATUS_CONFIG[phase.status]
                const phaseDone = phase.items.filter((i) => i.status === 'done').length
                const phaseProgress = (phaseDone / phase.items.length) * 100

                return (
                  <div key={phase.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-6 -translate-x-1/2 top-0 hidden md:flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${phaseConfig.dotColor} ring-4 ring-[#FAFAF8]`} />
                      {phase.status === 'in_progress' && (
                        <div className="absolute w-5 h-5 rounded-full bg-[#D4AF37]/20 animate-ping" />
                      )}
                    </div>

                    <div className="md:ml-16">
                      {/* Phase header */}
                      <div className="rounded-2xl border border-[#E5E5E0] bg-white p-5 mb-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${phaseConfig.bg} ${phaseConfig.color} shrink-0 w-fit`}>
                            <span>{phase.emoji}</span>
                            {phase.version} — {phase.name}
                            {phase.status === 'done' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="flex-1 hidden sm:block"><div className="h-px bg-[#E5E5E0]" /></div>
                          <span className="text-sm text-[#8E8EA0] shrink-0">{phaseDone}/{phase.items.length}</span>
                        </div>

                        <p className="text-[#4A4A68] text-sm mb-4">{phase.description}</p>

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
                          const diffConfig = DIFFICULTY_CONFIG[item.difficulty]

                          return (
                            <div
                              key={item.id}
                              className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${itemConfig.bg} shadow-sm`}
                            >
                              <itemConfig.icon className={`h-5 w-5 mt-0.5 shrink-0 ${itemConfig.color}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <p className={`text-sm font-medium ${item.status === 'done' ? 'text-gray-400 line-through' : 'text-[#1A1A2E]'}`}>
                                    {item.title}
                                  </p>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${diffConfig.color}`}>
                                    {diffConfig.text} {diffConfig.label}
                                  </span>
                                </div>
                                <p className="text-xs text-[#8E8EA0] leading-relaxed">{item.description}</p>
                                {item.note && (
                                  <p className="text-xs text-[#D4AF37] mt-1 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> {item.note}
                                  </p>
                                )}
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

          {/* Encouraging footer */}
          <div className="mt-16 p-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center">
            <PartyPopper className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
            <h3
              className="text-xl font-bold mb-3 text-[#1A1A2E]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Créer n&apos;a jamais été aussi accessible
            </h3>
            <p className="text-[#4A4A68] text-sm mb-6 max-w-xl mx-auto">
              La grande majorité des fonctionnalités sont faciles à implémenter. Avec Claude IA comme assistant,
              chaque étape est documentée et guidée pas à pas. Le MVP (V1→V4) est à portée de main.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold transition-colors text-sm shadow-sm"
              >
                <Zap className="h-4 w-4" />
                Devenir Créateur
              </Link>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E5E5E0] bg-white hover:border-[#D4AF37]/30 text-[#4A4A68] hover:text-[#1A1A2E] font-semibold transition-all text-sm"
              >
                Explorer les Tâches
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
