'use client'

import { useEffect, useState, useActionState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { sendCollabRequestAction } from '@/app/actions/collabs'
import {
  Star, Users, Handshake, Eye, MessageSquare,
  ArrowLeft, Send, Shield, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

type CreatorData = {
  id: string
  displayName: string | null
  avatarUrl: string | null
  reputationScore: number
  reputationBadge: string
  creatorProfile: {
    stageName: string | null
    niche: string | null
    style: string
    bio: string | null
    toneOfVoice: string | null
    avatarType: string | null
    publishFrequency: string | null
  } | null
  socialAccounts: {
    platform: string
    handle: string
    followersCount: number
    engagementRate: number
  }[]
  collabStats: {
    total: number
    avgRating: number
  }
  collabHistory: {
    id: string
    type: string
    status: string
    rating: number | null
    createdAt: string
  }[]
}

export default function CreatorProfilePage() {
  const params = useParams()
  const id = params.id as string

  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [state, formAction, isPending] = useActionState(sendCollabRequestAction, null)

  useEffect(() => {
    async function fetchCreator() {
      try {
        const res = await fetch(`/api/collabs/creators/${id}`)
        if (res.ok) {
          const data = await res.json()
          setCreator(data)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchCreator()
  }, [id])

  useEffect(() => {
    if (state?.success) {
      setShowForm(false)
    }
  }, [state])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-white/30">Chargement du profil...</div>
      </div>
    )
  }

  if (!creator || !creator.creatorProfile) {
    return (
      <div className="space-y-6">
        <Link href="/collabs" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au marketplace
        </Link>
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">Profil createur introuvable</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = creator.creatorProfile
  const totalFollowers = creator.socialAccounts.reduce((s, a) => s + a.followersCount, 0)

  const badgeColors: Record<string, { color: string; label: string }> = {
    bronze: { color: '#CD7F32', label: 'Bronze' },
    silver: { color: '#C0C0C0', label: 'Argent' },
    gold: { color: '#D4AF37', label: 'Or' },
    platinum: { color: '#E5E4E2', label: 'Platine' },
  }
  const badge = badgeColors[creator.reputationBadge] || badgeColors.bronze

  const collabTypeLabels: Record<string, string> = {
    SHOUTOUT: 'Shoutout',
    CO_CREATE: 'Co-creation',
    GUEST: 'Invite',
    AD_EXCHANGE: 'Echange pub',
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link href="/collabs" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour au marketplace
      </Link>

      {/* Profile header */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              {creator.avatarUrl && <AvatarImage src={creator.avatarUrl} alt={profile.stageName || ''} />}
              <AvatarFallback className="text-2xl">
                {(profile.stageName || creator.displayName || 'CR').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  {profile.stageName || creator.displayName || 'Createur'}
                </h1>
                <Badge
                  style={{
                    borderColor: `${badge.color}40`,
                    backgroundColor: `${badge.color}15`,
                    color: badge.color,
                  }}
                >
                  {badge.label}
                </Badge>
              </div>

              <p className="text-white/40 mb-3">
                {profile.niche || 'Multi-niche'} &middot; Style {profile.style.toLowerCase()}
                {profile.publishFrequency && ` &middot; ${profile.publishFrequency}`}
              </p>

              {profile.bio && (
                <p className="text-white/60 text-sm mb-4 max-w-2xl">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-semibold">{totalFollowers.toLocaleString()}</span>
                  <span className="text-white/40 text-sm">followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-white font-semibold">{creator.reputationScore.toFixed(0)}</span>
                  <span className="text-white/40 text-sm">reputation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-white font-semibold">{creator.collabStats.total}</span>
                  <span className="text-white/40 text-sm">collabs</span>
                </div>
                {creator.collabStats.avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-semibold">{creator.collabStats.avgRating.toFixed(1)}</span>
                    <span className="text-white/40 text-sm">note moy.</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Button
                onClick={() => setShowForm(!showForm)}
                className="gap-2"
              >
                <Handshake className="h-4 w-4" />
                {showForm ? 'Annuler' : 'Proposer une collab'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collab request form */}
      {showForm && (
        <Card variant="gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-[#D4AF37]" />
              Envoyer une demande de collab
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="toUserId" value={creator.id} />

              <div>
                <label className="block text-white/50 text-sm mb-1.5">Type de collaboration</label>
                <select
                  name="type"
                  required
                  className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                >
                  <option value="" className="bg-[#111]">Choisir un type...</option>
                  <option value="SHOUTOUT" className="bg-[#111]">Shoutout — Mention reciproque</option>
                  <option value="CO_CREATE" className="bg-[#111]">Co-creation — Video ensemble</option>
                  <option value="GUEST" className="bg-[#111]">Invite — Apparition sur une chaine</option>
                  <option value="AD_EXCHANGE" className="bg-[#111]">Echange pub — Promotion croisee</option>
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1.5">Message (optionnel)</label>
                <Textarea
                  name="message"
                  placeholder="Presentez votre projet, vos attentes..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1.5">
                  Tokens en escrow (optionnel)
                </label>
                <Input
                  name="escrowTokens"
                  type="number"
                  min="0"
                  defaultValue="0"
                  placeholder="0"
                />
                <p className="text-white/30 text-xs mt-1">
                  Les tokens seront bloques jusqu&apos;a la fin de la collab
                </p>
              </div>

              {state?.error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{state.error}</p>
                </div>
              )}

              {state?.success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-green-400 text-sm">Demande envoyee avec succes !</p>
                </div>
              )}

              <Button type="submit" disabled={isPending} loading={isPending}>
                <Send className="h-4 w-4" />
                Envoyer la demande
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Social accounts */}
      {creator.socialAccounts.length > 0 && (
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle>Reseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {creator.socialAccounts.map((account) => (
                <div
                  key={account.platform}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-white/60 text-xs font-bold">
                      {account.platform === 'TIKTOK' ? 'TK' :
                       account.platform === 'INSTAGRAM' ? 'IG' :
                       account.platform === 'YOUTUBE' ? 'YT' :
                       account.platform === 'FACEBOOK' ? 'FB' : 'X'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">@{account.handle}</p>
                    <p className="text-white/40 text-xs">
                      {account.followersCount.toLocaleString()} followers
                      {account.engagementRate > 0 && ` · ${account.engagementRate.toFixed(1)}% engage.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collab history */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-[#D4AF37]" />
            Historique des collabs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creator.collabHistory.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-10 w-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">Aucune collab terminee</p>
              <p className="text-white/20 text-xs mt-1">Soyez le premier a collaborer !</p>
            </div>
          ) : (
            <div className="space-y-2">
              {creator.collabHistory.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {collabTypeLabels[collab.type] || collab.type}
                    </Badge>
                    <span className="text-white/40 text-sm">
                      {new Date(collab.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {collab.rating !== null && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-white text-sm">{collab.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <Badge
                      variant={
                        collab.status === 'COMPLETED' ? 'success' :
                        collab.status === 'REJECTED' ? 'destructive' :
                        collab.status === 'CANCELLED' ? 'secondary' : 'warning'
                      }
                      className="text-xs"
                    >
                      {collab.status === 'COMPLETED' ? 'Terminee' :
                       collab.status === 'REJECTED' ? 'Refusee' :
                       collab.status === 'CANCELLED' ? 'Annulee' : collab.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
