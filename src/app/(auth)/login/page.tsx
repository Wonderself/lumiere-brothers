'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/actions/auth'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [state, action, isPending] = useActionState(loginAction, {})

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Bienvenue
        </h1>
        <p className="text-white/50">Connectez-vous à votre compte Lumière.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <form action={action} className="space-y-5">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          {state.error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            {isPending ? 'Connexion...' : 'Se Connecter'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-white/40">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-white/40">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  )
}
