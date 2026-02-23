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
      return <Badge className="border-blue-200 bg-blue-50 text-blue-600">Achat</Badge>
    case 'BONUS':
      return <Badge className="border-purple-200 bg-purple-50 text-purple-600">Bonus</Badge>
    case 'TASK_REWARD':
      return <Badge className="border-green-200 bg-green-50 text-green-600">Reward</Badge>
    case 'SPENT':
      return <Badge className="border-yellow-200 bg-yellow-50 text-yellow-600">Depense</Badge>
    case 'WITHDRAWAL':
      return <Badge className="border-red-200 bg-red-50 text-red-600">Retrait</Badge>
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
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
          Mes Lumens
        </h1>
        <p className="text-gray-500 mt-1">
          Gerez votre portefeuille de Lumens — la monnaie de la plateforme.
        </p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-50/30 pointer-events-none" />
        <div className="p-8 md:p-12 flex flex-col items-center text-center relative">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#D4AF37]/20 flex items-center justify-center mb-6">
            <Sun className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <h2
            className="text-lg font-semibold text-gray-600 mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Mes Lumens
          </h2>
          <div className="text-6xl md:text-7xl font-bold text-[#D4AF37] mb-3 tracking-tight">
            {user.lumenBalance.toLocaleString('fr-FR')}
          </div>
          <p className="text-gray-400 text-sm">
            1 Lumen = {lumenPrice}&#8364; — Votre porte-monnaie plateforme
          </p>
        </div>
      </div>

      {/* Purchase Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Acheter des Lumens
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Choisissez un pack — plus vous achetez, plus vous economisez.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <PurchaseForm />
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
              <ArrowDownCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Convertir en euros
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Vos Lumens seront convertis en euros et vires sous 14 jours ouvres. 0 frais.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <WithdrawForm currentBalance={user.lumenBalance} />
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-gray-500" />
            </div>
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Historique
            </h2>
          </div>
        </div>
        <div className="px-6 pb-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">Aucune transaction pour le moment.</p>
              <p className="text-gray-400 text-sm mt-1">
                Achetez vos premiers Lumens ou completez une tache pour commencer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-3 text-xs text-gray-400 font-medium">Date</th>
                    <th className="pb-3 text-xs text-gray-400 font-medium">Type</th>
                    <th className="pb-3 text-xs text-gray-400 font-medium">Description</th>
                    <th className="pb-3 text-xs text-gray-400 font-medium text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 pr-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateShort(tx.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        {getTxTypeBadge(tx.type)}
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-700 max-w-xs truncate">
                        {tx.description || '—'}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            tx.amount > 0 ? 'text-green-500' : 'text-red-500'
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
        </div>
      </div>
    </div>
  )
}
