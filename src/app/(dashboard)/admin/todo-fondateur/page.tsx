import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ListTodo, CheckCircle, Circle, Server, Scale, Briefcase,
  CreditCard, Mail, Shield, Globe, FileText, Rocket,
  Cpu, MessageSquare, Palette, Film, Megaphone,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — TODO Fondateur' }

type TodoItem = {
  label: string
  done: boolean
  note?: string
  icon?: React.ElementType
  priority?: 'high' | 'medium' | 'low'
}

type TodoSection = {
  title: string
  icon: React.ElementType
  color: string
  items: TodoItem[]
}

const sections: TodoSection[] = [
  {
    title: 'APIs & Services à Intégrer',
    icon: Server,
    color: 'text-blue-400',
    items: [
      { label: 'Stripe — Paiements contributeurs', done: false, note: 'Stripe Connect pour multi-party', icon: CreditCard, priority: 'high' },
      { label: 'Stripe — Abonnements (Free/Basic/Premium)', done: false, note: 'stripe.com/billing', icon: CreditCard, priority: 'high' },
      { label: 'Resend — Emails transactionnels', done: false, note: 'Vérification, notifications, receipts', icon: Mail, priority: 'high' },
      { label: 'Claude API — Revue IA automatique', done: false, note: 'Remplacer le mock par claude-sonnet-4-6', icon: Cpu, priority: 'high' },
      { label: 'Vercel Blob — Stockage fichiers soumissions', done: false, note: 'Ou AWS S3 / Cloudflare R2', icon: Server, priority: 'high' },
      { label: 'NextAuth — OAuth Providers (Google, GitHub)', done: false, note: 'En plus des credentials', icon: Shield, priority: 'medium' },
      { label: 'Upstash Redis — Cache production', done: false, note: 'Remplace le Redis local Docker', icon: Server, priority: 'medium' },
      { label: 'BTCPay Server — Paiements Lightning', done: false, note: 'Optionnel mais différenciant', icon: CreditCard, priority: 'low' },
      { label: 'Sentry — Monitoring erreurs', done: false, note: 'sentry.io/for/nextjs', icon: Shield, priority: 'medium' },
      { label: 'PostHog / Plausible — Analytics', done: false, note: 'Privacy-first analytics', icon: Globe, priority: 'low' },
    ],
  },
  {
    title: 'Étapes Légales',
    icon: Scale,
    color: 'text-purple-400',
    items: [
      { label: 'Création SAS — Statuts', done: false, note: 'Capital social, répartition parts', icon: FileText, priority: 'high' },
      { label: 'Immatriculation — Greffe du Tribunal', done: false, note: 'K-bis, SIRET', icon: FileText, priority: 'high' },
      { label: 'INPI — Dépôt marque "Lumière"', done: false, note: 'Classes 9, 35, 41 (logiciel, pub, divertissement)', icon: Shield, priority: 'high' },
      { label: 'CNIL — Déclaration traitement données', done: false, note: 'RGPD compliance, DPO', icon: Shield, priority: 'high' },
      { label: 'CGV / CGU / Mentions Légales', done: false, note: 'Faire rédiger par un avocat', icon: FileText, priority: 'high' },
      { label: 'Politique de Confidentialité', done: false, note: 'Conforme RGPD', icon: FileText, priority: 'high' },
      { label: 'Contrat Contributeur', done: false, note: 'Statut micro-tâche, cession droits, IP', icon: FileText, priority: 'high' },
      { label: 'Assurance RC Pro', done: false, note: 'Responsabilité civile professionnelle', icon: Shield, priority: 'medium' },
      { label: 'Compte bancaire professionnel', done: false, note: 'Qonto, Shine ou banque traditionnelle', icon: CreditCard, priority: 'high' },
      { label: 'Comptable / Expert-comptable', done: false, note: 'Trouver un cabinet', icon: Briefcase, priority: 'medium' },
    ],
  },
  {
    title: 'Étapes Business & Communication',
    icon: Briefcase,
    color: 'text-[#D4AF37]',
    items: [
      { label: 'Pitch Deck — 12 slides', done: false, note: 'Problème, solution, marché, modèle, équipe, roadmap', icon: Megaphone, priority: 'high' },
      { label: 'Business Plan — 30 pages', done: false, note: 'Prévisionnel 3 ans, CAC, LTV, churn', icon: FileText, priority: 'high' },
      { label: 'Landing Page finale — lumiere.film', done: true, note: 'Design Apple 2026, animations', icon: Globe },
      { label: 'Vidéo démo / trailer plateforme', done: false, note: '2 min max, motion design', icon: Film, priority: 'medium' },
      { label: 'Beta privée — 50 testeurs', done: false, note: 'Feedback loop, NPS', icon: MessageSquare, priority: 'high' },
      { label: 'Branding final — Logo, charte graphique', done: false, note: 'Logo doré, police Playfair Display', icon: Palette, priority: 'medium' },
      { label: 'Réseaux sociaux — X, LinkedIn, Instagram', done: false, note: 'Compte pro, contenu régulier', icon: Megaphone, priority: 'medium' },
      { label: 'Premier film de demo complet', done: false, note: 'Court-métrage 5 min pour showcaser la plateforme', icon: Film, priority: 'high' },
      { label: 'Communauté Discord / Telegram', done: false, note: 'Espace contributeurs et early adopters', icon: MessageSquare, priority: 'medium' },
      { label: 'Participation salon / concours startup', done: false, note: 'VivaTech, Station F, Web Summit', icon: Rocket, priority: 'low' },
    ],
  },
]

export default async function AdminTodoFondateurPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  // Calculate global progress
  const allItems = sections.flatMap(s => s.items)
  const totalItems = allItems.length
  const doneItems = allItems.filter(i => i.done).length
  const globalPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  const priorityCounts = {
    high: allItems.filter(i => i.priority === 'high' && !i.done).length,
    medium: allItems.filter(i => i.priority === 'medium' && !i.done).length,
    low: allItems.filter(i => i.priority === 'low' && !i.done).length,
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          <ListTodo className="h-7 w-7 text-[#D4AF37]" /> TODO Fondateur
        </h1>
        <p className="text-white/50">Check-list complète pour le lancement de Lumière.</p>
      </div>

      {/* Global progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/40">Progression globale</p>
              <p className="text-3xl font-bold text-[#D4AF37]">{globalPct}%</p>
              <p className="text-xs text-white/30 mt-1">{doneItems}/{totalItems} étapes complétées</p>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-red-400">{priorityCounts.high}</p>
                <p className="text-[10px] text-white/30">Haute</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-400">{priorityCounts.medium}</p>
                <p className="text-[10px] text-white/30">Moyenne</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{priorityCounts.low}</p>
                <p className="text-[10px] text-white/30">Basse</p>
              </div>
            </div>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] transition-all duration-700"
              style={{ width: `${globalPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionDone = section.items.filter(i => i.done).length
          const sectionTotal = section.items.length
          const sectionPct = Math.round((sectionDone / sectionTotal) * 100)

          return (
            <Card key={section.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold flex items-center gap-2 ${section.color}`}>
                    <section.icon className="h-5 w-5" /> {section.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/30">{sectionDone}/{sectionTotal}</span>
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060]"
                        style={{ width: `${sectionPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, idx) => {
                    const Icon = item.icon || Circle
                    const priorityColors = {
                      high: 'border-red-500/20 text-red-400',
                      medium: 'border-yellow-500/20 text-yellow-400',
                      low: 'border-green-500/20 text-green-400',
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          item.done ? 'bg-white/[0.01] opacity-50' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${item.done ? 'text-green-400' : 'text-white/20'}`}>
                          {item.done ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${item.done ? 'line-through text-white/30' : 'text-white/80'}`}>
                              {item.label}
                            </span>
                            {item.priority && !item.done && (
                              <Badge variant="outline" className={`text-[9px] ${priorityColors[item.priority]}`}>
                                {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </Badge>
                            )}
                          </div>
                          {item.note && (
                            <p className="text-xs text-white/30 mt-0.5">{item.note}</p>
                          )}
                        </div>
                        <Icon className={`h-4 w-4 shrink-0 ${item.done ? 'text-white/10' : 'text-white/20'}`} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
