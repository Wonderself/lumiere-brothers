'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import { z } from 'zod'

const commentSchema = z.object({
  taskId: z.string().min(1),
  content: z.string().min(1, 'Le commentaire ne peut pas être vide').max(2000),
})

export async function addCommentAction(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const parsed = commentSchema.safeParse({
    taskId: formData.get('taskId'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Données invalides' }
  }

  const { taskId, content } = parsed.data

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { claimedById: true, title: true },
  })

  if (!task) return { error: 'Tâche introuvable' }

  await prisma.taskComment.create({
    data: {
      taskId,
      userId: session.user.id,
      content,
    },
  })

  // Notify task owner if different from commenter
  if (task.claimedById && task.claimedById !== session.user.id) {
    await createNotification(task.claimedById, 'SYSTEM', 'Nouveau commentaire', {
      body: `Un commentaire a été ajouté sur la tâche "${task.title}"`,
      href: `/tasks/${taskId}`,
    })
  }

  revalidatePath(`/tasks/${taskId}`)
  return { success: true }
}

export async function deleteCommentAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const commentId = formData.get('commentId') as string
  if (!commentId) return

  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    select: { userId: true, taskId: true },
  })

  if (!comment || comment.userId !== session.user.id) return

  await prisma.taskComment.delete({ where: { id: commentId } })
  revalidatePath(`/tasks/${comment.taskId}`)
}
