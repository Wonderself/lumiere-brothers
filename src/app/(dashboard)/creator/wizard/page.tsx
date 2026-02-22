'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  User, Palette, Mic, Calendar, Sparkles, Check, ArrowRight, ArrowLeft,
  Eye, EyeOff, Blend, Camera, Bot, Music, Zap, Clock
} from 'lucide-react'

const STEPS = [
  { title: 'Style', icon: Eye, desc: 'Comment apparaissez-vous ?' },
  { title: 'Niche', icon: Sparkles, desc: 'Quel contenu créez-vous ?' },
  { title: 'Identité', icon: User, desc: 'Votre personnage' },
  { title: 'Avatar', icon: Palette, desc: 'Votre apparence visuelle' },
  { title: 'Voix', icon: Mic, desc: 'Comment vous sonnez' },
  { title: 'Planning', icon: Calendar, desc: 'Quand publier' },
  { title: 'Preview', icon: Check, desc: 'Validation finale' },
]

const NICHES = [
  'Motivation', 'Tech & IA', 'Finance', 'Gaming', 'Éducation', 'Comédie',
  'ASMR', 'Fitness', 'Cuisine', 'Voyage', 'Mode', 'Musique',
  'Storytelling', 'True Crime', 'Cinéma', 'Science', 'Business', 'Autre',
]

export default function CreatorWizardPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    style: 'NOFACE',
    niche: '',
    stageName: '',
    bio: '',
    toneOfVoice: '',
    avatarType: 'cartoon',
    voiceType: 'synthetic',
    publishFrequency: '3x_week',
    automationLevel: 'ASSISTED',
  })

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Création de votre personnage
        </h1>
        <p className="text-white/40 mt-2 text-sm sm:text-base">Étape {step + 1} sur {STEPS.length}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex items-center gap-1">
            <button
              onClick={() => setStep(i)}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= step ? 'bg-[#D4AF37]' : 'bg-white/10'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="hidden sm:flex justify-between text-[10px] text-white/20 px-1">
        {STEPS.map((s, i) => (
          <span key={i} className={i === step ? 'text-[#D4AF37]' : ''}>{s.title}</span>
        ))}
      </div>

      {/* Step Content */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Step 0 — Style */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Comment apparaissez-vous ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'FACE', label: 'Face', desc: 'Vous montrez votre visage', icon: Camera },
                  { id: 'NOFACE', label: 'NoFace', desc: 'Anonyme : avatar, doublage, personnage', icon: EyeOff },
                  { id: 'HYBRID', label: 'Hybride', desc: 'Mix des deux selon les vidéos', icon: Blend },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateForm('style', opt.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      form.style === opt.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <opt.icon className={`h-8 w-8 mb-3 ${form.style === opt.id ? 'text-[#D4AF37]' : 'text-white/30'}`} />
                    <p className="text-white font-semibold">{opt.label}</p>
                    <p className="text-white/40 text-sm mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Niche */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Quelle est votre niche ?</h2>
              <p className="text-white/40">L&apos;IA adaptera le contenu à votre audience cible.</p>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => updateForm('niche', niche)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      form.niche === niche
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
              <div>
                <Label className="text-white/60">Ou décrivez votre niche</Label>
                <Input
                  value={form.niche}
                  onChange={(e) => updateForm('niche', e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="Ex: Revues de films d'horreur coréens"
                />
              </div>
            </div>
          )}

          {/* Step 2 — Identity */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Votre identité de créateur</h2>
              <div>
                <Label className="text-white/60">Nom de scène *</Label>
                <Input
                  value={form.stageName}
                  onChange={(e) => updateForm('stageName', e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="Ex: CinéGeek, DarkNarrator, TechVibe..."
                />
              </div>
              <div>
                <Label className="text-white/60">Bio courte</Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => updateForm('bio', e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  rows={3}
                  placeholder="Décrivez votre personnage en quelques phrases..."
                />
              </div>
              <div>
                <Label className="text-white/60">Tone of voice</Label>
                <Input
                  value={form.toneOfVoice}
                  onChange={(e) => updateForm('toneOfVoice', e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1"
                  placeholder="Ex: Sarcastique et éducatif, Calme et mystérieux..."
                />
              </div>
            </div>
          )}

          {/* Step 3 — Avatar */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Votre apparence visuelle</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'cartoon', label: 'Cartoon', desc: 'Style dessin animé' },
                  { id: '3d', label: '3D Réaliste', desc: 'Avatar 3D photoréaliste' },
                  { id: 'anime', label: 'Anime', desc: 'Style manga japonais' },
                  { id: 'mascot', label: 'Mascotte', desc: 'Animal ou personnage fun' },
                  { id: 'digital_clone', label: 'Clone Digital', desc: 'Double numérique de vous' },
                  { id: 'stylized', label: 'Photo Stylisée', desc: 'Votre photo transformée' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateForm('avatarType', opt.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.avatarType === opt.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className="text-white font-semibold text-sm">{opt.label}</p>
                    <p className="text-white/40 text-xs mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Voice */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Votre voix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'natural', label: 'Ma voix naturelle', desc: 'Vous enregistrez vous-même', icon: Mic },
                  { id: 'clone', label: 'Clone vocal IA', desc: 'L\'IA copie votre voix (50 tokens)', icon: Bot },
                  { id: 'synthetic', label: 'Voix synthétique', desc: 'Choisissez dans la bibliothèque', icon: Music },
                  { id: 'multi', label: 'Multi-voix', desc: 'Plusieurs personnages', icon: Zap },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateForm('voiceType', opt.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                      form.voiceType === opt.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <opt.icon className={`h-6 w-6 shrink-0 mt-0.5 ${form.voiceType === opt.id ? 'text-[#D4AF37]' : 'text-white/30'}`} />
                    <div>
                      <p className="text-white font-semibold">{opt.label}</p>
                      <p className="text-white/40 text-sm mt-1">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Schedule */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Fréquence & automatisation</h2>
              <div>
                <Label className="text-white/60 mb-3 block">Fréquence de publication</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'daily', label: 'Quotidien', icon: Zap },
                    { id: '3x_week', label: '3x/semaine', icon: Calendar },
                    { id: 'weekly', label: 'Hebdomadaire', icon: Clock },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateForm('publishFrequency', opt.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        form.publishFrequency === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <opt.icon className={`h-5 w-5 mx-auto mb-2 ${form.publishFrequency === opt.id ? 'text-[#D4AF37]' : 'text-white/30'}`} />
                      <p className="text-white text-sm font-medium">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-white/60 mb-3 block">Niveau d&apos;automatisation</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'AUTO', label: '100% Auto', desc: 'L\'IA fait tout' },
                    { id: 'ASSISTED', label: 'Assisté', desc: 'Vous validez chaque étape' },
                    { id: 'EXPERT', label: 'Expert', desc: 'Vous contrôlez tout' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateForm('automationLevel', opt.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        form.automationLevel === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <p className="text-white text-sm font-semibold">{opt.label}</p>
                      <p className="text-white/40 text-xs mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6 — Preview */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Récapitulatif</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: 'Style', value: form.style },
                  { label: 'Niche', value: form.niche || '—' },
                  { label: 'Nom de scène', value: form.stageName || '—' },
                  { label: 'Avatar', value: form.avatarType },
                  { label: 'Voix', value: form.voiceType },
                  { label: 'Fréquence', value: form.publishFrequency },
                  { label: 'Automatisation', value: form.automationLevel },
                  { label: 'Tone', value: form.toneOfVoice || '—' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-white/[0.03]">
                    <p className="text-white/30 text-xs">{item.label}</p>
                    <p className="text-white font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <form action="/api/auth/session" method="POST">
                <input type="hidden" name="step" value="7" />
                {Object.entries(form).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value} />
                ))}
              </form>
              <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <p className="text-[#D4AF37] font-medium">Votre profil créateur est prêt !</p>
                <p className="text-white/50 text-sm mt-1">
                  Cliquez &quot;Terminer&quot; pour activer votre studio et commencer à générer des vidéos.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-white/40 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Précédent</span><span className="sm:hidden">Retour</span>
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors min-h-[44px]"
          >
            Suivant <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <form action={`/creator`}>
            <input type="hidden" name="step" value="7" />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-colors min-h-[44px]"
            >
              <Check className="h-4 w-4" /> Terminer
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
