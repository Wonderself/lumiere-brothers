import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sun, ArrowDownCircle, Gift, Sparkles, ShoppingCart } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'
import { PurchaseForm } from './purchase-form'
import { WithdrawForm } from './withdraw-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mes Lumens' }

function getTxTypeBadge(type: string) {
  switch (type) {
    case 'PURCHASE':
      return <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400">Achat</Badge>
    case 'BONUS':
      return <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-400">Bonus</Badge>
    case 'TASK_REWARD':
      return <Badge className="border-green-500/30 bg-green-500/10 text-green-400">Reward</Badge>
    case 'SPENT':
      return <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400">Depense</Badge>
    case 'WITHDRAWAL':
      return <Badge className="border-red-500/30 bg-red-500/10 text-red-400">Retrait</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

export default async function LumensPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  if (!user) redirect('/login')

  const transactions = await prisma.lumenTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const settings = await prisma.adminSettings.findUnique({
    where: { id: 'singleton' },
    select: { lumenPrice: true },
  })

  const lumenPrice = settings?.lumenPrice ?? 1.0

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
          Mes Lumens
        </h1>
        <p className="text-white/50 mt-1">
          Gerez votre portefeuille de Lumens — la monnaie de la plateforme.
        </p>
      </div>

      {/* Balance Card */}
      <Card variant="gold" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#D4AF37]/3 pointer-events-none" />
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center relative">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
            <Sun className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <h2
            className="text-lg font-semibold text-white/70 mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Mes Lumens
          </h2>
          <div className="text-6xl md:text-7xl font-bold text-[#D4AF37] mb-3 tracking-tight">
            {user.lumenBalance.toLocaleString('fr-FR')}
          </div>
          <p className="text-white/40 text-sm">
            1 Lumen = {lumenPrice}&#8364; — Votre porte-monnaie plateforme
          </p>
        </CardContent>
      </Card>

      {/* Purchase Section */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <CardTitle
                className="text-xl"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Acheter des Lumens
              </CardTitle>
              <p className="text-white/40 text-sm mt-0.5">
                Choisissez un pack — plus vous achetez, plus vous economisez.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PurchaseForm />
        </CardContent>
      </Card>

      {/* Withdraw Section */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <ArrowDownCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle
                className="text-xl"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Convertir en euros
              </CardTitle>
              <p className="text-white/40 text-sm mt-0.5">
                Vos Lumens seront convertis en euros et vires sous 14 jours ouvres. 0 frais.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WithdrawForm currentBalance={user.lumenBalance} />
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white/60" />
            </div>
            <CardTitle
              className="text-xl"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Historique
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Aucune transaction pour le moment.</p>
              <p className="text-white/25 text-sm mt-1">
                Achetez vos premiers Lumens ou completez une tache pour commencer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-xs text-white/40 font-medium">Date</th>
                    <th className="pb-3 text-xs text-white/40 font-medium">Type</th>
                    <th className="pb-3 text-xs text-white/40 font-medium">Description</th>
                    <th className="pb-3 text-xs text-white/40 font-medium text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4 text-sm text-white/60 whitespace-nowrap">
                        {formatDateShort(tx.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        {getTxTypeBadge(tx.type)}
                      </td>
                      <td className="py-3 pr-4 text-sm text-white/70 max-w-xs truncate">
                        {tx.description || '—'}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
