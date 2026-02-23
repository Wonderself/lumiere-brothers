import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Crown, Star, Check, ChevronDown,
  User, Rocket, Shield, HelpCircle, Coins,
  Building2, Sparkles
} from 'lucide-react'
import { PlanButton, TokenPackButton } from './plan-button'
import { SUBSCRIPTION_PLANS, TOKEN_PACKS, TOKEN_COSTS } from '@/lib/tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Abonnement & Tokens' }

const PLAN_META = {
  free: { icon: User, color: 'gray-500', borderColor: 'border-gray-200', bgColor: 'bg-white', recommended: false },
  starter: { icon: Rocket, color: '[#D4AF37]', borderColor: 'border-gray-200', bgColor: 'bg-white', recommended: false },
  pro: { icon: Crown, color: '[#D4AF37]', borderColor: 'border-[#D4AF37]/30', bgColor: 'bg-amber-50/30', recommended: true },
  business: { icon: Building2, color: '[#D4AF37]', borderColor: 'border-gray-200', bgColor: 'bg-white', recommended: false },
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          Abonnement & Tokens
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Choisissez votre plan. Alimentez vos créations IA.
        </p>
        {/* Current status inline */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-gray-500 text-sm">Plan :</span>
            <span className="text-gray-900 font-medium text-sm">
              {currentPlan === 'FREE' ? 'Gratuit' : currentPlan === 'STARTER' ? 'Starter' : currentPlan === 'PRO' ? 'Pro' : 'Business'}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-gray-900 font-medium text-sm">{user.lumenBalance}</span>
            <span className="text-gray-400 text-sm">Lumens</span>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const meta = PLAN_META[plan.id]
          const isCurrent = plan.id.toUpperCase() === currentPlan || (plan.id === 'free' && currentPlan === 'FREE')
          const isRec = !!meta.recommended
          const PlanIcon = meta.icon

          return (
            <div key={plan.id} className="relative">
              {isRec && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs shadow-sm">
                    Recommandé
                  </Badge>
                </div>
              )}

              <div className={`h-full flex flex-col rounded-2xl border transition-all p-1 ${
                isRec
                  ? 'bg-amber-50/50 border-[#D4AF37]/30 scale-[1.02] shadow-md'
                  : 'bg-white border-gray-200 shadow-sm'
              } ${isCurrent ? 'ring-1 ring-[#D4AF37]/30' : ''}`}>
                <div className="pb-2 text-center pt-6 px-4">
                  <PlanIcon className={`h-6 w-6 mx-auto mb-3 ${isRec ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  <h3 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-playfair)]">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className={`text-3xl font-bold ${isRec ? 'text-[#D4AF37]' : 'text-gray-900'}`}>
                      {plan.price === 0 ? '0' : plan.price.toFixed(0)}
                    </span>
                    <span className="text-sm text-gray-400">&#8364;/mois</span>
                  </div>
                  {plan.tokensPerMonth > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{plan.tokensPerMonth} Lumens/mois</p>
                  )}
                  {plan.tokensOneTime > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{plan.tokensOneTime} Lumens offerts</p>
                  )}
                </div>

                <div className="flex-1 flex flex-col pt-4 px-4 pb-4">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <Check className={`h-3.5 w-3.5 shrink-0 ${isRec ? 'text-[#D4AF37]' : 'text-green-500'}`} />
                        <span className="text-xs text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PlanButton
                    planId={plan.id.toUpperCase()}
                    planName={plan.name}
                    isCurrent={isCurrent}
                    isRecommended={isRec}
                    isFree={plan.price === 0}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Token Packs */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-5 font-[family-name:var(--font-playfair)] text-center">
          Recharger des Lumens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {TOKEN_PACKS.slice(0, 3).map((pack, i) => {
            const isBestValue = i === 2
            return (
              <div key={pack.id} className="relative">
                {isBestValue && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="border-green-200 bg-green-50 text-green-600 text-[10px]">
                      Meilleur rapport
                    </Badge>
                  </div>
                )}
                <div className={`h-full rounded-2xl border transition-all hover:border-[#D4AF37]/30 hover:shadow-md ${
                  isBestValue ? 'bg-amber-50/30 border-[#D4AF37]/20 shadow-sm' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="p-6 text-center space-y-3">
                    <h3 className="text-gray-900 font-semibold">{pack.name}</h3>
                    <p className="text-3xl font-bold text-gray-900">{pack.tokens}</p>
                    <p className="text-gray-400 text-xs">
                      Lumens
                      {pack.bonus > 0 && <span className="text-green-500 ml-1">+{pack.bonus} bonus</span>}
                    </p>
                    <div className="pt-3">
                      <p className="text-[#D4AF37] text-xl font-bold">{pack.price.toFixed(2).replace('.', ',')}&#8364;</p>
                    </div>
                    <TokenPackButton isBestValue={isBestValue} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Token Costs */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-600 transition-colors list-none justify-center">
          <Sparkles className="h-4 w-4 text-[#D4AF37]/60" />
          <span>Grille tarifaire des Lumens</span>
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { label: 'Vidéo HD', cost: TOKEN_COSTS.VIDEO_GEN_STANDARD, unit: '' },
            { label: 'Vidéo 4K', cost: TOKEN_COSTS.VIDEO_GEN_4K, unit: '' },
            { label: 'Clone Voix', cost: TOKEN_COSTS.CLONE_VOICE, unit: '' },
            { label: 'Publication', cost: TOKEN_COSTS.PUBLISH_MULTI, unit: '/plateforme' },
            { label: 'A/B Test', cost: TOKEN_COSTS.AB_TEST, unit: '/variant' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-gray-500 text-xs">{item.label}</span>
              <span className="text-[#D4AF37] text-xs font-medium">{item.cost}{item.unit}</span>
            </div>
          ))}
        </div>
      </details>

      {/* Launch Note */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <Shield className="h-4 w-4 text-[#D4AF37]/60 shrink-0" />
        <p className="text-xs text-gray-400">
          Les paiements seront disponibles lors du lancement officiel.
        </p>
      </div>

      {/* FAQ */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-600 transition-colors list-none justify-center">
          <HelpCircle className="h-4 w-4" />
          <span>Questions fréquentes</span>
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-3 max-w-3xl mx-auto">
          {FAQ.map((item) => (
            <div key={item.question} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{item.question}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
