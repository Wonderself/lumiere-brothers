import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Crown, Star, Zap, Check, ChevronDown,
  User, Rocket, Shield, HelpCircle, Coins,
  Package, Building2, Sparkles
} from 'lucide-react'
import { PlanButton } from './plan-button'
import { SUBSCRIPTION_PLANS, TOKEN_PACKS, TOKEN_COSTS } from '@/lib/tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Abonnement & Tokens' }

const PLAN_META = {
  free: { icon: User, color: 'white/60', borderColor: 'border-white/10', bgColor: 'bg-white/[0.02]', recommended: false },
  starter: { icon: Rocket, color: '[#D4AF37]', borderColor: 'border-white/10', bgColor: 'bg-white/[0.03]', recommended: false },
  pro: { icon: Crown, color: '[#D4AF37]', borderColor: 'border-[#D4AF37]/30', bgColor: 'bg-[rgba(212,175,55,0.05)]', recommended: true },
  business: { icon: Building2, color: '[#D4AF37]', borderColor: 'border-[#D4AF37]/20', bgColor: 'bg-[rgba(212,175,55,0.03)]', recommended: false },
} as const

const FAQ = [
  {
    question: 'Puis-je changer de plan a tout moment ?',
    answer: 'Oui, vous pouvez upgrader ou downgrader a tout moment. Le changement prend effet a la prochaine facturation. Upgrade = prorata calcule automatiquement.',
  },
  {
    question: 'Comment fonctionnent les tokens ?',
    answer: 'Les tokens sont la monnaie interne pour toutes les actions IA : generation video, clone voix, publication, A/B testing... Chaque action a un cout fixe en tokens, visible dans la grille tarifaire.',
  },
  {
    question: 'Les tokens expirent-ils ?',
    answer: 'Les tokens achetes en pack ne expirent jamais. Les tokens mensuels de l\'abonnement se renouvellent chaque mois (non cumulables). Les bonus de parrainage sont permanents.',
  },
  {
    question: 'Le paiement est-il securise ?',
    answer: 'Tous les paiements sont traites par Stripe. Vos informations bancaires ne transitent jamais par nos serveurs. Visa, Mastercard, SEPA acceptes.',
  },
] as const

export default async function SubscriptionPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  if (!user) redirect('/login')

  const currentPlan = user.subscription?.plan ?? 'FREE'

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">
          Abonnement & Tokens
        </h1>
        <p className="text-white/50 mt-1 text-sm sm:text-base">
          Choisissez votre plan et achetez des tokens pour alimenter vos creations IA.
        </p>
      </div>

      {/* Current Plan + Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-white/40">Plan actuel</p>
                <p className="text-lg font-semibold text-white">
                  {currentPlan === 'FREE' ? 'Gratuit' : currentPlan === 'STARTER' ? 'Starter' : currentPlan === 'PRO' ? 'Pro' : currentPlan === 'BUSINESS' ? 'Business' : currentPlan}
                </p>
              </div>
            </div>
            <Badge className={currentPlan === 'FREE' ? 'border-white/20 bg-white/5 text-white/60' : 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]'}>
              Actif
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/40">Solde tokens</p>
                <p className="text-lg font-semibold text-white">{user.lumenBalance} tokens</p>
              </div>
            </div>
            <Badge className="border-purple-500/20 bg-purple-500/10 text-purple-400">
              Lumens
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Plan Cards */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">Plans d&apos;abonnement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const meta = PLAN_META[plan.id]
            const isCurrent = plan.id.toUpperCase() === currentPlan || (plan.id === 'free' && currentPlan === 'FREE')
            const PlanIcon = meta.icon

            return (
              <div key={plan.id} className="relative">
                {meta.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="border-[#D4AF37]/50 bg-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                      <Zap className="h-3 w-3 mr-1" />
                      Recommande
                    </Badge>
                  </div>
                )}

                <Card className={`h-full flex flex-col ${meta.bgColor} ${meta.borderColor} ${isCurrent ? 'ring-1 ring-[#D4AF37]/30' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        meta.recommended || plan.id === 'business'
                          ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <PlanIcon className={`h-5 w-5 ${
                          meta.recommended || plan.id === 'business' ? 'text-[#D4AF37]' : 'text-white/60'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-[family-name:var(--font-playfair)]">{plan.name}</CardTitle>
                        {plan.tokensPerMonth > 0 && (
                          <p className="text-xs text-[#D4AF37]/60">{plan.tokensPerMonth} tokens/mois</p>
                        )}
                        {plan.tokensOneTime > 0 && (
                          <p className="text-xs text-white/40">{plan.tokensOneTime} tokens offerts</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`text-3xl font-bold ${
                        meta.recommended || plan.id === 'business' ? 'text-[#D4AF37]' : 'text-white'
                      }`}>
                        {plan.price === 0 ? '0' : plan.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-sm text-white/40">&#8364;/mois</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            meta.recommended || plan.id === 'business'
                              ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                              : 'bg-green-500/15 text-green-400'
                          }`}>
                            <Check className="h-2.5 w-2.5" />
                          </div>
                          <span className="text-xs text-white/60">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <PlanButton
                      planId={plan.id.toUpperCase()}
                      planName={plan.name}
                      isCurrent={isCurrent}
                      isRecommended={!!meta.recommended}
                      isFree={plan.price === 0}
                    />
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Token Packs */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)] flex items-center gap-2">
          <Package className="h-5 w-5 text-[#D4AF37]" />
          Packs de Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TOKEN_PACKS.map((pack) => (
            <Card key={pack.id} className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/30 transition-all">
              <CardContent className="p-5 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-[#D4AF37]/10 mx-auto flex items-center justify-center">
                  <Coins className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-white font-semibold">{pack.name}</h3>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">{pack.tokens}</p>
                  <p className="text-white/30 text-xs">tokens</p>
                  {pack.bonus > 0 && (
                    <Badge className="bg-green-500/10 border-green-500/20 text-green-400 text-[10px]">
                      +{pack.bonus} bonus
                    </Badge>
                  )}
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[#D4AF37] text-lg font-bold">{pack.price.toFixed(2).replace('.', ',')}&#8364;</p>
                  <p className="text-white/20 text-[10px]">
                    {(pack.price / (pack.tokens + pack.bonus) * 100).toFixed(1).replace('.', ',')} ct/token
                  </p>
                </div>
                <button
                  className="w-full py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-colors"
                  onClick={undefined}
                >
                  Acheter
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Token Costs Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)] flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#D4AF37]" />
          Grille tarifaire
        </h2>
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {[
                { label: 'Vidéo Standard', cost: TOKEN_COSTS.VIDEO_GEN_STANDARD, unit: '' },
                { label: 'Vidéo 4K', cost: TOKEN_COSTS.VIDEO_GEN_4K, unit: '' },
                { label: 'Clone Voix', cost: TOKEN_COSTS.CLONE_VOICE, unit: '' },
                { label: 'Publication', cost: TOKEN_COSTS.PUBLISH_MULTI, unit: '/plateforme' },
                { label: 'Outreach', cost: TOKEN_COSTS.OUTREACH, unit: '/contact' },
                { label: 'Analytics Pro', cost: TOKEN_COSTS.ANALYTICS_PRO, unit: '/mois' },
                { label: 'A/B Test', cost: TOKEN_COSTS.AB_TEST, unit: '/variant' },
                { label: '+30 sec', cost: TOKEN_COSTS.VIDEO_EXTRA_30S, unit: '' },
                { label: 'Modification', cost: TOKEN_COSTS.REGEN_MODIFY, unit: '' },
                { label: 'Sans watermark', cost: TOKEN_COSTS.WATERMARK_REMOVE, unit: '/mois' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-white/60 text-xs">{item.label}</span>
                  <Badge variant="outline" className="border-[#D4AF37]/20 text-[#D4AF37] text-[10px]">
                    {item.cost}{item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">
              Paiements Stripe en cours d&apos;integration
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              Les abonnements et achats de tokens seront connectes via Stripe Connect.
              En attendant, les tokens de demo sont disponibles via le seed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white/60" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-playfair)]">
            Questions frequentes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {FAQ.map((item) => (
            <Card key={item.question} className="bg-white/[0.03] border-white/10">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-3">
                  <ChevronDown className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <h3 className="text-sm font-semibold text-white/90">{item.question}</h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed pl-7">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
