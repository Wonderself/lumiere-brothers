import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TOKEN_COSTS } from '@/lib/tokens'
import { getBadgeForScore } from '@/lib/reputation'
import { getInitials } from '@/lib/utils'
import { OutreachContactButton } from './outreach-contact-button'
import {
  Megaphone, Users, ShoppingBag, Share2, Zap, Coins,
  Send, AlertTriangle, CheckCircle2, Clock, Sparkles,
  Bot, Eye, Star, TrendingUp, Trophy
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Outreach Automatise' }

// Mocked AI suggestions — in production these would come from an ML model
const MOCK_SUGGESTIONS = [
  {
    id: 'sug-1',
    name: 'CinematicPro',
    niche: 'Cinema IA',
    followers: 45200,
    score: 82,
    badge: 'gold',
    reason: 'Niche similaire, audience complementaire, taux engagement eleve',
    matchScore: 94,
    platform: 'YOUTUBE',
  },
  {
    id: 'sug-2',
    name: 'VisualStories',
    niche: 'Storytelling visuel',
    followers: 23800,
    score: 71,
    badge: 'silver',
    reason: 'Contenu video IA compatible, audience croisee potentielle',
    matchScore: 87,
    platform: 'TIKTOK',
  },
  {
    id: 'sug-3',
    name: 'AICreatorFR',
    niche: 'Tech & IA',
    followers: 67300,
    score: 88,
    badge: 'gold',
    reason: 'Grosse audience tech, deja mentionne des outils similaires',
    matchScore: 82,
    platform: 'INSTAGRAM',
  },
  {
    id: 'sug-4',
    name: 'NoFaceFactory',
    niche: 'NoFace Content',
    followers: 12400,
    score: 65,
    badge: 'silver',
    reason: 'Createur noface en croissance, ouvert aux collabs',
    matchScore: 79,
    platform: 'TIKTOK',
  },
  {
    id: 'sug-5',
    name: 'DigitalArtParis',
    niche: 'Art numerique',
    followers: 31500,
    score: 76,
    badge: 'gold',
    reason: 'Audience artistique, contenu complementaire',
    matchScore: 75,
    platform: 'INSTAGRAM',
  },
  {
    id: 'sug-6',
    name: 'FuturFilms',
    niche: 'Films courts',
    followers: 8900,
    score: 58,
    badge: 'silver',
    reason: 'Createur emergent, forte croissance mensuelle (+40%)',
    matchScore: 71,
    platform: 'YOUTUBE',
  },
]

export default async function OutreachPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if (!user) redirect('/login')

  // Get outreach history (lumen transactions with type OUTREACH)
  const outreachHistory = await prisma.lumenTransaction.findMany({
    where: {
      userId: session.user.id,
      type: 'OUTREACH',
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const totalOutreach = outreachHistory.length
  const totalSpent = outreachHistory.reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
  const costPerContact = TOKEN_COSTS.OUTREACH

  const navLinks = [
    { href: '/collabs', label: 'Marketplace', icon: Users, active: false },
    { href: '/collabs/orders', label: 'Commandes', icon: ShoppingBag, active: false },
    { href: '/collabs/referrals', label: 'Parrainage', icon: Share2, active: false },
    { href: '/collabs/achievements', label: 'Accomplissements', icon: Trophy, active: false },
    { href: '/collabs/outreach', label: 'Outreach', icon: Megaphone, active: true },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Outreach Automatise
          </h1>
          <p className="text-white/40 mt-1 text-sm sm:text-base">
            Suggestions IA de createurs a contacter pour des collabs
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Coins className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-semibold">{user.lumenBalance} tokens</span>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[44px] ${
              link.active
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <link.icon className="h-4 w-4" /> {link.label}
          </Link>
        ))}
      </div>

      {/* Cost info banner */}
      <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-white font-medium">
                Cout: {costPerContact} tokens / contact — Validation obligatoire
              </p>
              <p className="text-white/40 text-sm">
                Chaque prise de contact est facturee {costPerContact} tokens. Une confirmation vous sera demandee avant tout envoi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Contacts envoyes', value: totalOutreach, icon: Send, color: 'text-blue-400' },
          { label: 'Tokens depenses', value: totalSpent, icon: Coins, color: 'text-[#D4AF37]' },
          { label: 'Cout/contact', value: `${costPerContact}`, icon: Zap, color: 'text-purple-400' },
          { label: 'Suggestions IA', value: MOCK_SUGGESTIONS.length, icon: Sparkles, color: 'text-green-400' },
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

      {/* AI Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-[#D4AF37]" />
          <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-playfair)]">
            Suggestions IA
          </h2>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" /> Personnalise
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MOCK_SUGGESTIONS.map((suggestion) => {
            const badgeInfo = getBadgeForScore(suggestion.score)
            return (
              <Card key={suggestion.id} className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/20 transition-all">
                <CardContent className="p-5">
                  {/* Match score */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.platform === 'TIKTOK' ? 'TikTok' :
                       suggestion.platform === 'INSTAGRAM' ? 'Instagram' :
                       suggestion.platform === 'YOUTUBE' ? 'YouTube' :
                       suggestion.platform === 'FACEBOOK' ? 'Facebook' : 'X'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-sm font-bold">{suggestion.matchScore}%</span>
                      <span className="text-white/30 text-xs">match</span>
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback>
                        {getInitials(suggestion.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{suggestion.name}</p>
                      <p className="text-white/40 text-sm">{suggestion.niche}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {suggestion.followers.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {suggestion.score}/100
                    </span>
                    <Badge
                      className="text-[10px]"
                      style={{
                        borderColor: `${badgeInfo.color}40`,
                        backgroundColor: `${badgeInfo.color}15`,
                        color: badgeInfo.color,
                      }}
                    >
                      {badgeInfo.label}
                    </Badge>
                  </div>

                  {/* AI Reason */}
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 mb-4">
                    <p className="text-white/50 text-xs flex items-start gap-1.5">
                      <Bot className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#D4AF37]" />
                      {suggestion.reason}
                    </p>
                  </div>

                  {/* Contact button with mandatory confirmation */}
                  <OutreachContactButton
                    suggestionId={suggestion.id}
                    suggestionName={suggestion.name}
                    cost={costPerContact}
                    balance={user.lumenBalance}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Outreach History */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/40" />
            Historique des contacts ({totalOutreach})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {outreachHistory.length === 0 ? (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-lg">Aucun contact effectue</p>
              <p className="text-white/20 text-sm mt-1">
                Utilisez les suggestions IA pour contacter des createurs
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {outreachHistory.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Send className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{tx.description || 'Contact outreach'}</p>
                      <p className="text-white/30 text-xs">
                        {tx.createdAt.toLocaleDateString('fr-FR')} a {tx.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-red-400 text-sm font-medium shrink-0">
                    -{Math.abs(tx.amount)} tokens
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

