'use client'

import { useEffect, useState, useActionState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { createOrderAction, claimOrderAction } from '@/app/actions/orders'
import Link from 'next/link'
import {
  ShoppingBag, Plus, Package, Clock, CheckCircle2,
  ArrowLeft, Users, Share2, Megaphone, AlertCircle, Coins, Trophy
} from 'lucide-react'

type Order = {
  id: string
  title: string
  description: string
  style: string | null
  duration: number | null
  deadline: string | null
  priceTokens: number
  status: string
  revisionCount: number
  maxRevisions: number
  clientRating: number | null
  createdAt: string
  client: { id: string; displayName: string | null }
  creator: { id: string; displayName: string | null } | null
}

function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'OPEN':
      return { variant: 'success' as const, label: 'Ouverte' }
    case 'CLAIMED':
      return { variant: 'warning' as const, label: 'Acceptee' }
    case 'IN_PROGRESS':
      return { variant: 'warning' as const, label: 'En cours' }
    case 'DELIVERED':
      return { variant: 'default' as const, label: 'Livree' }
    case 'REVISION':
      return { variant: 'destructive' as const, label: 'Revision' }
    case 'COMPLETED':
      return { variant: 'success' as const, label: 'Terminee' }
    case 'DISPUTED':
      return { variant: 'destructive' as const, label: 'Litige' }
    default:
      return { variant: 'secondary' as const, label: status }
  }
}

export default function OrdersPage() {
  const [receivedOrders, setReceivedOrders] = useState<Order[]>([])
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [openOrders, setOpenOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createState, createAction, isCreating] = useActionState(createOrderAction, null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/collabs/orders')
        if (res.ok) {
          const data = await res.json()
          setReceivedOrders(data.receivedOrders || [])
          setMyOrders(data.myOrders || [])
          setOpenOrders(data.openOrders || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    if (createState?.success) {
      setShowCreateForm(false)
      // Refresh
      window.location.reload()
    }
  }, [createState])

  const navLinks = [
    { href: '/collabs', label: 'Marketplace', icon: Users, active: false },
    { href: '/collabs/orders', label: 'Commandes', icon: ShoppingBag, active: true },
    { href: '/collabs/referrals', label: 'Parrainage', icon: Share2, active: false },
    { href: '/collabs/achievements', label: 'Accomplissements', icon: Trophy, active: false },
    { href: '/collabs/outreach', label: 'Outreach', icon: Megaphone, active: false },
  ]

  function OrderCard({ order, role }: { order: Order; role: 'client' | 'creator' | 'open' }) {
    const statusBadge = getOrderStatusBadge(order.status)

    return (
      <Link href={`/collabs/orders/${order.id}`}>
        <Card className="bg-white/[0.03] border-white/10 hover:border-[#D4AF37]/20 hover:bg-white/[0.05] transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{order.title}</p>
                <p className="text-white/40 text-sm line-clamp-1 mt-0.5">{order.description}</p>
              </div>
              <Badge variant={statusBadge.variant} className="ml-3 shrink-0">
                {statusBadge.label}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs text-white/40">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-medium">{order.priceTokens} tokens</span>
                </span>
                {order.deadline && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.deadline).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {order.duration && (
                  <span>{order.duration}s</span>
                )}
              </div>
              <div>
                {role === 'client' && order.creator && (
                  <span>Createur: {order.creator.displayName || 'Anonyme'}</span>
                )}
                {role === 'creator' && (
                  <span>Client: {order.client.displayName || 'Anonyme'}</span>
                )}
                {role === 'open' && (
                  <span>Par: {order.client.displayName || 'Anonyme'}</span>
                )}
              </div>
            </div>
            {order.revisionCount > 0 && (
              <div className="mt-2">
                <span className="text-xs text-orange-400">
                  {order.revisionCount}/{order.maxRevisions} revisions utilisees
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Commandes Video
          </h1>
          <p className="text-white/40 mt-1 text-sm sm:text-base">
            Gerez vos commandes et proposez vos services
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2 min-h-[44px]">
          <Plus className="h-4 w-4" />
          {showCreateForm ? 'Annuler' : 'Creer une commande'}
        </Button>
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

      {/* Create order form */}
      {showCreateForm && (
        <Card variant="gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#D4AF37]" />
              Nouvelle commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createAction} className="space-y-4">
              <div>
                <label className="block text-white/50 text-sm mb-1.5">Titre *</label>
                <Input name="title" required placeholder="Ex: Video promo 30s pour mon produit" />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1.5">Description *</label>
                <Textarea
                  name="description"
                  required
                  placeholder="Decrivez en detail ce que vous attendez..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/50 text-sm mb-1.5">Style souhaite</label>
                  <Input name="style" placeholder="Ex: dynamique, minimaliste..." />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1.5">Duree (secondes)</label>
                  <Input name="duration" type="number" min="5" placeholder="30" />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1.5">Date limite</label>
                  <Input name="deadline" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-sm mb-1.5">Prix (tokens) *</label>
                  <Input name="priceTokens" type="number" min="1" required placeholder="50" />
                  <p className="text-white/30 text-xs mt-1">Mis en escrow jusqu&apos;a la livraison</p>
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1.5">Revisions max</label>
                  <Input name="maxRevisions" type="number" min="0" max="5" defaultValue="2" />
                </div>
              </div>

              {createState?.error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {createState.error}
                  </p>
                </div>
              )}

              <Button type="submit" disabled={isCreating} loading={isCreating}>
                Creer la commande
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-white/30">Chargement des commandes...</div>
        </div>
      ) : (
        <Tabs defaultValue="received">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
            <TabsList className="w-max sm:w-auto">
              <TabsTrigger value="received" className="min-h-[40px]">
                <Package className="h-4 w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Commandes recues</span>
                <span className="sm:hidden">Recues</span> ({receivedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="mine" className="min-h-[40px]">
                <ShoppingBag className="h-4 w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Mes commandes</span>
                <span className="sm:hidden">Miennes</span> ({myOrders.length})
              </TabsTrigger>
              <TabsTrigger value="open" className="min-h-[40px]">
                <CheckCircle2 className="h-4 w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Disponibles</span>
                <span className="sm:hidden">Dispo</span> ({openOrders.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Received orders (as creator) */}
          <TabsContent value="received">
            {receivedOrders.length === 0 ? (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 text-lg">Aucune commande recue</p>
                  <p className="text-white/20 text-sm mt-1">
                    Consultez les commandes disponibles et acceptez-en une
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {receivedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} role="creator" />
                ))}
              </div>
            )}
          </TabsContent>

          {/* My orders (as client) */}
          <TabsContent value="mine">
            {myOrders.length === 0 ? (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 text-lg">Aucune commande passee</p>
                  <p className="text-white/20 text-sm mt-1">
                    Creez votre premiere commande video
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myOrders.map((order) => (
                  <OrderCard key={order.id} order={order} role="client" />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Open orders */}
          <TabsContent value="open">
            {openOrders.length === 0 ? (
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 text-lg">Aucune commande disponible</p>
                  <p className="text-white/20 text-sm mt-1">
                    Revenez plus tard pour de nouvelles opportunites
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {openOrders.map((order) => (
                  <OrderCard key={order.id} order={order} role="open" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
