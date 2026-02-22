'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordAction } from '@/app/actions/auth'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, null)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Mot de passe oublié
        </h1>
        <p className="text-white/50">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8">
        {state?.success ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-14 w-14 text-[#D4AF37] mx-auto" />
            <p className="text-white/80 text-sm leading-relaxed">
              Un email de réinitialisation a été envoyé à votre adresse.
            </p>
            <p className="text-white/40 text-xs">
              Vérifiez votre boîte de réception et vos spams.
            </p>
          </div>
        ) : (
          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  autoComplete="email"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isPending}>
              {isPending ? 'Envoi en cours...' : 'Envoyer le lien'}
            </Button>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-white/40">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
