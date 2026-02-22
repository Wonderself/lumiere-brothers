import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Orders received as creator
  const receivedOrders = await prisma.videoOrder.findMany({
    where: { creatorUserId: userId },
    include: {
      client: { select: { id: true, displayName: true } },
      creator: { select: { id: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Orders created as client
  const myOrders = await prisma.videoOrder.findMany({
    where: { clientUserId: userId },
    include: {
      client: { select: { id: true, displayName: true } },
      creator: { select: { id: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Open orders (excluding user's own)
  const openOrders = await prisma.videoOrder.findMany({
    where: {
      status: 'OPEN',
      clientUserId: { not: userId },
    },
    include: {
      client: { select: { id: true, displayName: true } },
      creator: { select: { id: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const serialize = (orders: typeof receivedOrders) =>
    orders.map((o) => ({
      ...o,
      deadline: o.deadline?.toISOString() || null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }))

  return NextResponse.json({
    receivedOrders: serialize(receivedOrders),
    myOrders: serialize(myOrders),
    openOrders: serialize(openOrders),
  })
}
