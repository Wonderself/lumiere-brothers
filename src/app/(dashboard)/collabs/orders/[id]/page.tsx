'use client'

import { useEffect, useState, useActionState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  claimOrderAction,
  deliverOrderAction,
  requestRevisionAction,
  completeOrderAction,
} from '@/app/actions/orders'
import Link from 'next/link'
import {
  ArrowLeft, Package, Clock, Coins, CheckCircle2,
  Send, RotateCcw, Star, AlertTriangle, FileVideo,
  User, Shield
} from 'lucide-react'

type OrderDetail = {
  id: string
  title: string
  description: string
  style: string | null
  duration: number | null
  deadline: string | null
  priceTokens: number
  status: string
  deliveryUrl: string | null
  revisionCount: number
  maxRevisions: number
  clientRating: number | null
  creatorRating: number | null
  createdAt: string
  updatedAt: string
  client: { id: string; displayName: string | null; avatarUrl: string | null }
  creator: { id: string; displayName: string | null; avatarUrl: string | null } | null
  isClient: boolean
  isCreator: boolean
}

function getOrderStatusConfig(status: string) {
  switch (status) {
    case 'OPEN':
      return { variant: 'success' as const, label: 'Ouverte', color: 'text-green-400' }
    case 'CLAIMED':
      return { variant: 'warning' as const, label: 'Acceptee', color: 'text-yellow-400' }
    case 'IN_PROGRESS':
      return { variant: 'warning' as const, label: 'En cours', color: 'text-yellow-400' }
    case 'DELIVERED':
      return { variant: 'default' as const, label: 'Livree', color: 'text-[#D4AF37]' }
    case 'REVISION':
      return { variant: 'destructive' as const, label: 'Revision demandee', color: 'text-orange-400' }
    case 'COMPLETED':
      return { variant: 'success' as const, label: 'Terminee', color: 'text-green-400' }
    case 'DISPUTED':
      return { variant: 'destructive' as const, label: 'Litige', color: 'text-red-400' }
    default:
      return { variant: 'secondary' as const, label: status, color: 'text-white/40' }
  }
}

const STATUS_FLOW = ['OPEN', 'CLAIMED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED']

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [deliveryUrl, setDeliveryUrl] = useState('')
  const [revisionReason, setRevisionReason] = useState('')
  const [clientRating, setClientRating] = useState('5')

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/collabs/orders/${id}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-white/30">Chargement de la commande...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Link href="/collabs/orders" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour aux commandes
        </Link>
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">Commande introuvable</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = getOrderStatusConfig(order.status)
  const currentStepIndex = STATUS_FLOW.indexOf(order.status)

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link href="/collabs/orders" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            {order.title}
          </h1>
          <p className="text-white/40 mt-1">
            Commande creee le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <Badge variant={statusConfig.variant} className="text-sm px-3 py-1">
          {statusConfig.label}
        </Badge>
      </div>

      {/* Status flow */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            {STATUS_FLOW.map((step, i) => {
              const isActive = i <= currentStepIndex
              const isCurrent = step === order.status
              const stepLabels: Record<string, string> = {
                OPEN: 'Ouverte',
                CLAIMED: 'Acceptee',
                IN_PROGRESS: 'En cours',
                DELIVERED: 'Livree',
                COMPLETED: 'Terminee',
              }
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent ? 'bg-[#D4AF37] text-black' :
                      isActive ? 'bg-[#D4AF37]/30 text-[#D4AF37]' :
                      'bg-white/5 text-white/20'
                    }`}>
                      {isActive && !isCurrent ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 ${isCurrent ? 'text-[#D4AF37]' : isActive ? 'text-white/50' : 'text-white/20'}`}>
                      {stepLabels[step]}
                    </span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                      i < currentStepIndex ? 'bg-[#D4AF37]/40' : 'bg-white/5'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          {/* Show REVISION status separately if active */}
          {order.status === 'REVISION' && (
            <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-orange-400 text-sm flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Revision demandee ({order.revisionCount}/{order.maxRevisions})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-sm whitespace-pre-wrap">{order.description}</p>
              {order.style && (
                <div className="mt-4">
                  <p className="text-white/40 text-xs mb-1">Style souhaite</p>
                  <Badge variant="outline">{order.style}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery */}
          {order.deliveryUrl && (
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileVideo className="h-5 w-5 text-green-400" />
                  Livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={order.deliveryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline text-sm break-all"
                >
                  {order.deliveryUrl}
                </a>
              </CardContent>
            </Card>
          )}

          {/* Actions based on role and status */}
          {/* Creator: deliver */}
          {order.isCreator && ['CLAIMED', 'IN_PROGRESS', 'REVISION'].includes(order.status) && (
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-[#D4AF37]" />
                  Livrer la commande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={async (fd) => { await deliverOrderAction(fd); window.location.reload() }} className="space-y-4">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div>
                    <label className="block text-white/50 text-sm mb-1.5">URL de livraison</label>
                    <Input
                      name="deliveryUrl"
                      value={deliveryUrl}
                      onChange={(e) => setDeliveryUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      required
                    />
                  </div>
                  <Button type="submit" className="gap-2">
                    <Send className="h-4 w-4" /> Livrer
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Client: request revision */}
          {order.isClient && order.status === 'DELIVERED' && order.revisionCount < order.maxRevisions && (
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-400" />
                  Demander une revision ({order.revisionCount}/{order.maxRevisions})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={async (fd) => { await requestRevisionAction(fd); window.location.reload() }} className="space-y-4">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div>
                    <label className="block text-white/50 text-sm mb-1.5">Raison (optionnel)</label>
                    <Textarea
                      name="reason"
                      value={revisionReason}
                      onChange={(e) => setRevisionReason(e.target.value)}
                      placeholder="Expliquez ce qui doit etre modifie..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" variant="outline" className="gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                    <RotateCcw className="h-4 w-4" /> Demander une revision
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Client: complete order */}
          {order.isClient && order.status === 'DELIVERED' && (
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  Valider et completer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={async (fd) => { await completeOrderAction(fd); window.location.reload() }} className="space-y-4">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div>
                    <label className="block text-white/50 text-sm mb-1.5">Note du createur (optionnel)</label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setClientRating(n.toString())}
                          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                            parseInt(clientRating) >= n
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-white/5 text-white/30 hover:bg-white/10'
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      ))}
                      <span className="text-white/50 text-sm">{clientRating}/5</span>
                    </div>
                    <input type="hidden" name="clientRating" value={clientRating} />
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 text-sm">
                      En validant, {order.priceTokens} tokens seront transferes au createur.
                    </p>
                  </div>
                  <Button type="submit" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Valider la livraison
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Open order: claim */}
          {!order.isClient && !order.isCreator && order.status === 'OPEN' && (
            <Card variant="gold">
              <CardContent className="p-6">
                <form action={async (fd) => { await claimOrderAction(fd); window.location.reload() }}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Accepter cette commande ?</p>
                      <p className="text-white/40 text-sm mt-1">
                        Vous recevrez {order.priceTokens} tokens a la livraison validee
                      </p>
                    </div>
                    <Button type="submit" className="gap-2">
                      <Package className="h-4 w-4" /> Accepter
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Completed info */}
          {order.status === 'COMPLETED' && (
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-green-400 font-semibold text-lg">Commande terminee</p>
                {order.clientRating && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < order.clientRating! ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/10'}`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & details */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Prix</span>
                <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                  <Coins className="h-4 w-4" /> {order.priceTokens} tokens
                </span>
              </div>
              {order.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">Duree</span>
                  <span className="text-white text-sm">{order.duration}s</span>
                </div>
              )}
              {order.deadline && (
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">Deadline</span>
                  <span className="text-white text-sm flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-white/30" />
                    {new Date(order.deadline).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Revisions</span>
                <span className="text-white text-sm">{order.revisionCount}/{order.maxRevisions}</span>
              </div>
              {order.revisionCount >= order.maxRevisions && (
                <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">
                  <p className="text-orange-400 text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Revisions epuisees
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" /> Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                  {(order.client.displayName || 'CL').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{order.client.displayName || 'Anonyme'}</p>
                  {order.isClient && (
                    <Badge variant="outline" className="text-[10px] mt-0.5">Vous</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator */}
          <Card className="bg-white/[0.03] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" /> Createur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.creator ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                    {(order.creator.displayName || 'CR').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{order.creator.displayName || 'Anonyme'}</p>
                    {order.isCreator && (
                      <Badge variant="outline" className="text-[10px] mt-0.5">Vous</Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-white/30 text-sm">Aucun createur assigne</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
