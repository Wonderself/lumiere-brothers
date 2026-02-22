import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Coins, TrendingUp, Film, Users, Clock, Shield,
  ArrowRight, Landmark, ChartBar, Wallet, Vote,
  Briefcase, Star, Zap, Lock, CheckCircle2,
  BarChart3, CircleDollarSign, Sparkles
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  formatEur, getOfferingProgress, getTimeRemaining,
  RISK_LABELS, OFFERING_STATUS_LABELS,
} from '@/lib/tokenization'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tokenization — Investissez dans le Cinéma IA',
  description: 'Co-produisez des films IA en acquérant des tokens. Revenus partagés, gouvernance communautaire.',
}

// Sub-navigation tabs
function TokenizationNav({ active }: { active: string }) {
  const tabs = [
    { key: 'marketplace', label: 'Marketplace', href: '/tokenization', icon: Coins },
    { key: 'portfolio', label: 'Mon Portfolio', href: '/tokenization/portfolio', icon: Briefcase },
    { key: 'governance', label: 'Gouvernance', href: '/tokenization/governance', icon: Vote },
  ]

  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/5 w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
            active === tab.key
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default async function TokenizationMarketplacePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Fetch active offerings with their films
  const offerings = await prisma.filmTokenOffering.findMany({
    where: { status: { in: ['OPEN', 'FUNDED'] } },
    include: {
      film: true,
      _count: { select: { purchases: true, proposals: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Recently funded
  const recentlyFunded = await prisma.filmTokenOffering.findMany({
    where: { status: 'FUNDED' },
    include: { film: true },
    orderBy: { fundedAt: 'desc' },
    take: 4,
  })

  // Platform stats
  const totalRaised = await prisma.filmTokenOffering.aggregate({ _sum: { raised: true } })
  const totalOfferings = await prisma.filmTokenOffering.count({ where: { status: { in: ['OPEN', 'FUNDED'] } } })
  const totalInvestors = await prisma.filmTokenPurchase.groupBy({
    by: ['userId'],
    where: { status: 'CONFIRMED' },
  })

  const platformStats = {
    totalRaised: totalRaised._sum.raised || 0,
    activeOfferings: totalOfferings,
    totalInvestors: totalInvestors.length,
    avgROI: 18.5, // Demo value
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sub-Nav */}
      <TokenizationNav active="marketplace" />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 via-black to-[#D4AF37]/5 p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.15),transparent_60%)]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
                <Landmark className="h-3 w-3 mr-1" />
                ISA Israel
              </Badge>
              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                Régulé
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Investissez dans le Cinéma IA
            </h1>
            <p className="text-white/50 max-w-xl text-sm sm:text-base leading-relaxed">
              Co-produisez des films générés par intelligence artificielle. Achetez des tokens,
              participez aux décisions créatives, et percevez des revenus sur chaque exploitation.
              Cadre juridique israélien — offres exemptées ISA.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/tokenization/portfolio">
                <Button variant="outline" className="min-h-[44px]">
                  <Wallet className="h-4 w-4 mr-2" />
                  Mon Portfolio
                </Button>
              </Link>
              <Link href="/tokenization/governance">
                <Button variant="ghost" className="min-h-[44px]">
                  <Vote className="h-4 w-4 mr-2" />
                  Gouvernance
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 lg:w-80">
            {[
              { label: 'Total levé', value: formatEur(platformStats.totalRaised), icon: CircleDollarSign, color: 'text-[#D4AF37]' },
              { label: 'Offres actives', value: platformStats.activeOfferings.toString(), icon: Film, color: 'text-blue-400' },
              { label: 'Investisseurs', value: platformStats.totalInvestors.toString(), icon: Users, color: 'text-green-400' },
              { label: 'ROI moyen', value: `${platformStats.avgROI}%`, icon: TrendingUp, color: 'text-purple-400' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/[0.05] border border-white/10 p-3 sm:p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-white text-lg sm:text-xl font-bold">{stat.value}</p>
                <p className="text-white/30 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Offerings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Offres en Cours
          </h2>
          <Badge variant="secondary">{offerings.filter(o => o.status === 'OPEN').length} ouvertes</Badge>
        </div>

        {offerings.length === 0 ? (
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-[#D4AF37]/30 mx-auto mb-4" />
              <p className="text-white/50 text-sm">Aucune offre active pour le moment.</p>
              <p className="text-white/30 text-xs mt-1">De nouvelles opportunités arrivent bientôt.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offerings.map((offering) => {
              const progress = getOfferingProgress(offering)
              const remaining = offering.totalTokens - offering.tokensSold
              const risk = RISK_LABELS[offering.riskLevel] || RISK_LABELS.MEDIUM
              const timeLeft = getTimeRemaining(offering.closesAt)

              return (
                <Link key={offering.id} href={`/tokenization/${offering.filmId}`}>
                  <Card className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/30 transition-all h-full group overflow-hidden">
                    {/* Film Cover */}
                    <div className="relative h-40 bg-gradient-to-br from-[#D4AF37]/10 to-purple-500/10 overflow-hidden">
                      {offering.film.coverImageUrl ? (
                        <img
                          src={offering.film.coverImageUrl}
                          alt={offering.film.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-12 w-12 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <Badge className={`${risk.bgColor} text-xs`}>
                          {risk.label}
                        </Badge>
                        {offering.status === 'FUNDED' && (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Financé
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-1">{offering.film.title}</h3>
                        {offering.film.genre && (
                          <p className="text-white/50 text-xs">{offering.film.genre}</p>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-white/50 text-xs">Levée</span>
                          <span className="text-white text-xs font-semibold">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[#D4AF37] text-xs font-medium">{formatEur(offering.raised)}</span>
                          <span className="text-white/30 text-xs">/ {formatEur(offering.hardCap)}</span>
                        </div>
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-white/[0.03] p-2">
                          <p className="text-white/30 text-[10px]">Prix/Token</p>
                          <p className="text-white text-sm font-semibold">{formatEur(offering.tokenPrice)}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] p-2">
                          <p className="text-white/30 text-[10px]">Disponibles</p>
                          <p className="text-white text-sm font-semibold">{remaining.toLocaleString('fr-FR')}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          {offering.projectedROI && (
                            <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400">
                              <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                              ROI ~{offering.projectedROI}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-white/30 text-[10px]">
                          <Clock className="h-3 w-3" />
                          {timeLeft}
                        </div>
                      </div>

                      {/* CTA */}
                      {offering.status === 'OPEN' && (
                        <Button className="w-full min-h-[44px] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                          <Coins className="h-4 w-4 mr-2" />
                          Investir
                          <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Recently Funded */}
      {recentlyFunded.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Récemment Financés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentlyFunded.map((offering) => (
              <Link key={offering.id} href={`/tokenization/${offering.filmId}`}>
                <Card className="bg-white/[0.03] border-white/10 hover:border-green-500/20 transition-all group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold truncate">{offering.film.title}</p>
                      <p className="text-green-400 text-xs">{formatEur(offering.raised)} levés</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/10 group-hover:text-green-400 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
          Comment ça Marche
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Choisissez',
              description: 'Parcourez les films en cours de financement et analysez les projections de revenus.',
              icon: Film,
              color: 'text-blue-400',
              bgColor: 'bg-blue-500/10',
            },
            {
              step: '02',
              title: 'Investissez',
              description: 'Achetez des tokens à partir de 10€. Chaque token représente une part du film.',
              icon: Coins,
              color: 'text-[#D4AF37]',
              bgColor: 'bg-[#D4AF37]/10',
            },
            {
              step: '03',
              title: 'Votez',
              description: 'Participez aux décisions créatives : casting, distribution, marketing.',
              icon: Vote,
              color: 'text-purple-400',
              bgColor: 'bg-purple-500/10',
            },
            {
              step: '04',
              title: 'Gagnez',
              description: 'Recevez des dividendes sur chaque exploitation du film : streaming, licences, merchandising.',
              icon: TrendingUp,
              color: 'text-green-400',
              bgColor: 'bg-green-500/10',
            },
          ].map((item) => (
            <Card key={item.step} className="bg-white/[0.03] border-white/10 hover:border-white/20 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-white/10 text-2xl font-bold font-[family-name:var(--font-playfair)]">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Legal Disclaimer */}
      <Card className="bg-white/[0.02] border-white/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-white/20 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-white/30 text-xs leading-relaxed">
                <strong className="text-white/50">Avertissement légal :</strong> Les tokens proposés sur cette plateforme sont émis
                dans le cadre du régime d&apos;offres exemptées de l&apos;Israel Securities Authority (ISA), sous le seuil de 5 millions ILS.
                L&apos;investissement dans des projets cinématographiques comporte des risques significatifs, incluant la perte
                totale du capital investi. Les projections de ROI sont indicatives et ne constituent pas une garantie de rendement.
              </p>
              <p className="text-white/30 text-xs leading-relaxed">
                Lumière Brothers Ltd. est enregistrée en Israël. Les tokens ne constituent pas des valeurs mobilières au sens du
                droit européen ou américain. Consultez un conseiller financier agréé avant tout investissement. Investissez
                uniquement des sommes que vous pouvez vous permettre de perdre.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
