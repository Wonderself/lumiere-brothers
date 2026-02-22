import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await props.params
  const userId = session.user.id

  const order = await prisma.videoOrder.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, displayName: true, avatarUrl: true } },
      creator: { select: { id: true, displayName: true, avatarUrl: true } },
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...order,
    deadline: order.deadline?.toISOString() || null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    isClient: order.clientUserId === userId,
    isCreator: order.creatorUserId === userId,
  })
}
