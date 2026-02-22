'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { registerAction } from '@/app/actions/auth'
import { SKILLS, LANGUAGES } from '@/lib/constants'
import { CheckCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(registerAction, {})
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Français'])
  const [role, setRole] = useState('CONTRIBUTOR')

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push('/login?registered=1'), 2000)
    }
  }, [state.success, router])

  if (state.success) {
    return (
      <div className="text-center space-y-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-12">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
        <h2 className="text-2xl font-bold">Compte créé !</h2>
        <p className="text-white/50">
          Votre compte est en attente de validation par notre équipe. Vous recevrez un email dès que votre compte sera activé.
        </p>
        <p className="text-sm text-white/30">Redirection vers la connexion...</p>
      </div>
    )
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Rejoindre Lumière
        </h1>
        <p className="text-white/50">Créez votre compte et commencez à contribuer.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <form action={action} className="space-y-6">
          {/* Hidden fields for arrays */}
          {selectedSkills.map((skill) => (
            <input key={skill} type="hidden" name="skills" value={skill} />
          ))}
          {selectedLanguages.map((lang) => (
            <input key={lang} type="hidden" name="languages" value={lang} />
          ))}
          <input type="hidden" name="role" value={role} />

          {state.error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nom / Pseudo</Label>
              <Input id="displayName" name="displayName" placeholder="Jean Dupont" required minLength={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" placeholder="Minimum 8 caractères" required minLength={8} />
          </div>

          <div className="space-y-2">
            <Label>Rôle souhaité</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTRIBUTOR">Contributeur Créatif</SelectItem>
                <SelectItem value="ARTIST">Artiste / Directeur Artistique</SelectItem>
                <SelectItem value="STUNT_PERFORMER">Cascadeur / Performer</SelectItem>
                <SelectItem value="SCREENWRITER">Scénariste</SelectItem>
                <SelectItem value="VIEWER">Spectateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL (optionnel)</Label>
            <Input id="portfolioUrl" name="portfolioUrl" type="url" placeholder="https://votre-portfolio.com" />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label>Compétences ({selectedSkills.length} sélectionnées)</Label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    selectedSkills.includes(skill)
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label>Langues maîtrisées</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    selectedLanguages.includes(lang)
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            {isPending ? 'Création du compte...' : 'Créer mon Compte'}
          </Button>

          <p className="text-xs text-white/30 text-center">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/legal/terms" className="text-[#D4AF37]/60 hover:text-[#D4AF37]">CGU</Link>
            {' '}et notre{' '}
            <Link href="/legal/privacy" className="text-[#D4AF37]/60 hover:text-[#D4AF37]">politique de confidentialité</Link>.
          </p>
        </form>
      </div>

      <p className="text-center text-sm text-white/40">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
