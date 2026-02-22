import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      creatorProfile: true,
      socialAccounts: {
        where: { isActive: true },
        select: {
          platform: true,
          handle: true,
          followersCount: true,
          engagementRate: true,
        },
      },
      receivedCollabs: {
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          type: true,
          status: true,
          rating: true,
          createdAt: true,
        },
      },
    },
  })

  if (!user || !user.creatorProfile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const completedCollabs = user.receivedCollabs
  const ratedCollabs = completedCollabs.filter((c) => c.rating !== null)
  const avgRating = ratedCollabs.length > 0
    ? ratedCollabs.reduce((s, c) => s + (c.rating || 0), 0) / ratedCollabs.length
    : 0

  return NextResponse.json({
    id: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    reputationScore: user.reputationScore,
    reputationBadge: user.reputationBadge,
    creatorProfile: {
      stageName: user.creatorProfile.stageName,
      niche: user.creatorProfile.niche,
      style: user.creatorProfile.style,
      bio: user.creatorProfile.bio,
      toneOfVoice: user.creatorProfile.toneOfVoice,
      avatarType: user.creatorProfile.avatarType,
      publishFrequency: user.creatorProfile.publishFrequency,
    },
    socialAccounts: user.socialAccounts,
    collabStats: {
      total: completedCollabs.length,
      avgRating,
    },
    collabHistory: completedCollabs.map((c) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      rating: c.rating,
      createdAt: c.createdAt.toISOString(),
    })),
  })
}
