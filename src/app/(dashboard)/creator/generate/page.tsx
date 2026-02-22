import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Wand2,
  Sparkles,
  SlidersHorizontal,
  Coins,
  ArrowLeft,
  Clock,
  Zap,
  MonitorPlay,
  CheckCircle2,
} from 'lucide-react'
import { generateVideoAction } from '@/app/actions/creator'

const PLATFORMS = [
  { value: 'TIKTOK', label: 'TikTok', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400 peer-checked:bg-pink-500/20 peer-checked:border-pink-500' },
  { value: 'INSTAGRAM', label: 'Instagram', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400 peer-checked:bg-purple-500/20 peer-checked:border-purple-500' },
  { value: 'YOUTUBE', label: 'YouTube', color: 'bg-red-500/10 border-red-500/30 text-red-400 peer-checked:bg-red-500/20 peer-checked:border-red-500' },
  { value: 'X', label: 'X (Twitter)', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 peer-checked:bg-blue-500/20 peer-checked:border-blue-500' },
] as const

const DURATIONS = [
  { value: '15', label: '15s', desc: 'Short / Reel' },
  { value: '30', label: '30s', desc: 'Standard' },
  { value: '60', label: '60s', desc: 'Long form' },
  { value: '90', label: '90s', desc: 'Extended' },
] as const

const MODES = [
  {
    id: 'auto',
    label: 'Auto',
    desc: "L'IA fait tout automatiquement",
    icon: Sparkles,
    detail: 'Script, voix, montage et publication en un clic. Idéal pour les débutants.',
    color: 'border-[#D4AF37]/30 bg-[#D4AF37]/5',
    activeColor: 'border-[#D4AF37] bg-[#D4AF37]/10 ring-2 ring-[#D4AF37]/20',
  },
  {
    id: 'assisted',
    label: 'Assisté',
    desc: 'Valider chaque étape',
    icon: CheckCircle2,
    detail: "L'IA propose, vous validez. Contrôle à chaque étape du pipeline.",
    color: 'border-blue-500/30 bg-blue-500/5',
    activeColor: 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20',
  },
  {
    id: 'expert',
    label: 'Expert',
    desc: 'Contrôle total',
    icon: SlidersHorizontal,
    detail: 'Paramétrez chaque détail : prompts, voix, timing, transitions.',
    color: 'border-purple-500/30 bg-purple-500/5',
    activeColor: 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20',
  },
] as const

export default async function GeneratePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !profile.wizardCompleted) {
    redirect('/creator/wizard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  const tokenBalance = user?.lumenBalance ?? 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/creator"
            className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors shrink-0 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Générer une Vidéo
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Pipeline de création IA complet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 self-start sm:self-auto">
          <Coins className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-semibold">{tokenBalance}</span>
          <span className="text-white/40 text-sm">tokens</span>
        </div>
      </div>

      <form action={async (formData: FormData) => {
        'use server'
        await generateVideoAction(null, formData)
      }}>
        {/* Mode Selection Tabs */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#D4AF37]" />
              Mode de Génération
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {MODES.map((mode, index) => (
                <label key={mode.id} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="mode"
                    value={mode.id}
                    defaultChecked={index === 0}
                    className="peer sr-only"
                  />
                  <div className={`p-4 rounded-xl border transition-all duration-200 ${mode.color} peer-checked:${mode.activeColor.split(' ').join(' peer-checked:')}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <mode.icon className="h-5 w-5 text-white/70" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{mode.label}</p>
                        <p className="text-white/40 text-xs">{mode.desc}</p>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs mt-2 leading-relaxed">
                      {mode.detail}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Details */}
        <Card className="bg-white/[0.03] border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-[#D4AF37]" />
              Détails de la Vidéo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la vidéo</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: 5 secrets que personne ne vous dit sur..."
                required
              />
            </div>

            {/* Script */}
            <div className="space-y-2">
              <Label htmlFor="script">Script / Contenu</Label>
              <Textarea
                id="script"
                name="script"
                placeholder="Écrivez votre script ici ou laissez vide pour que l'IA le génère automatiquement..."
                rows={6}
                className="min-h-[140px]"
              />
              <p className="text-white/20 text-xs">
                Laissez vide en mode Auto pour une génération complète par l&apos;IA.
              </p>
            </div>

            {/* Platforms */}
            <div className="space-y-3">
              <Label>Plateformes de publication</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PLATFORMS.map((platform) => (
                  <label key={platform.value} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="platforms"
                      value={platform.value}
                      className="peer sr-only"
                    />
                    <div
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${platform.color}`}
                    >
                      <span className="text-sm font-medium">{platform.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label>Durée</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DURATIONS.map((dur, i) => (
                  <label key={dur.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="duration"
                      value={dur.value}
                      defaultChecked={i === 1}
                      className="peer sr-only"
                    />
                    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-200 peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/10 peer-checked:ring-2 peer-checked:ring-[#D4AF37]/20">
                      <Clock className="h-4 w-4 text-white/40 peer-checked:text-[#D4AF37]" />
                      <span className="text-white font-semibold text-sm">{dur.label}</span>
                      <span className="text-white/30 text-xs">{dur.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Cost & Submit */}
        <Card className="bg-white/[0.03] border-white/10 mt-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Cost Breakdown */}
              <div className="space-y-3 flex-1">
                <h3 className="text-white font-semibold text-sm">Coût estimé</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Génération standard (HD)</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <Coins className="h-3 w-3 text-[#D4AF37]" /> 10 tokens
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Qualité 4K (optionnel)</span>
                    <span className="text-white/40 font-medium flex items-center gap-1">
                      <Coins className="h-3 w-3 text-white/20" /> 25 tokens
                    </span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-medium">Votre solde</span>
                    <span className={`font-bold flex items-center gap-1 ${tokenBalance >= 10 ? 'text-green-400' : 'text-red-400'}`}>
                      <Coins className="h-3.5 w-3.5" /> {tokenBalance} tokens
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
                {tokenBalance < 10 ? (
                  <>
                    <div className="text-red-400 text-sm text-center md:text-right">
                      Solde insuffisant. Rechargez vos tokens.
                    </div>
                    <Link
                      href="/lumens"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors"
                    >
                      <Coins className="h-4 w-4" />
                      Acheter des Tokens
                    </Link>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#F0D060] transition-colors text-base shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                  >
                    <Wand2 className="h-5 w-5" />
                    Lancer la Génération
                  </button>
                )}
                <p className="text-white/20 text-xs text-center md:text-right">
                  Coût : 10 tokens (HD) ou 25 tokens (4K)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4K Quality Toggle */}
        <Card className="bg-white/[0.03] border-white/10 mt-4">
          <CardContent className="p-4">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Qualité 4K Ultra</p>
                  <p className="text-white/30 text-xs">Résolution maximale, rendu premium (+15 tokens)</p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" name="quality4k" value="true" className="peer sr-only" />
                <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-[#D4AF37] transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
