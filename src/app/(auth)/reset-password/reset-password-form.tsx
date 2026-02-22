'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordAction } from '@/app/actions/auth'
import { Lock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function ResetPasswordForm({ token }: { token?: string }) {
  const [state, action, isPending] = useActionState(resetPasswordAction, null)

  if (!token) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Lien invalide
          </h1>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-8 text-center space-y-4">
          <AlertTriangle className="h-14 w-14 text-red-400 mx-auto" />
          <p className="text-white/70 text-sm">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <p className="text-white/40 text-xs">
            Veuillez demander un nouveau lien de réinitialisation.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/forgot-password"
            className="text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium text-sm"
          >
            Demander un nouveau lien
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 transition-colors text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Nouveau mot de passe
        </h1>
        <p className="text-white/50">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8">
        {state?.success ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-14 w-14 text-[#D4AF37] mx-auto" />
            <p className="text-white/80 text-sm leading-relaxed">
              Mot de passe réinitialisé ! Vous pouvez vous connecter.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#F0D060] transition-colors"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <form action={action} className="space-y-5">
            <input type="hidden" name="token" value={token} />

            {state?.error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Retapez le mot de passe"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isPending}>
              {isPending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        )}
      </div>

      {!state?.success && (
        <p className="text-center text-sm text-white/40">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la connexion
          </Link>
        </p>
      )}
    </div>
  )
}
