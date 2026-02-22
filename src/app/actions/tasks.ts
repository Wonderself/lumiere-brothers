'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { runMockAiReview } from '@/lib/ai-review'
import { registerContentHash } from '@/lib/content-hash'
import { createNotification } from '@/lib/notifications'

export async function claimTaskAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const taskId = formData.get('taskId') as string
  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.status !== 'AVAILABLE') return

  // Check concurrent task limit
  const settings = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } })
  const maxConcurrent = settings?.maxConcurrentTasks || 3

  const activeTasks = await prisma.task.count({
    where: {
      claimedById: session.user.id,
      status: { in: ['CLAIMED', 'SUBMITTED', 'AI_REVIEW', 'HUMAN_REVIEW'] },
    },
  })

  if (activeTasks >= maxConcurrent) return

  // Set deadline to 48h from now
  const deadline = new Date()
  deadline.setHours(deadline.getHours() + 48)

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'CLAIMED',
      claimedById: session.user.id,
      claimedAt: new Date(),
      deadline,
    },
  })

  revalidatePath(`/tasks/${taskId}`)
  redirect(`/tasks/${taskId}`)
}

export async function submitTaskAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const taskId = formData.get('taskId') as string
  const notes = formData.get('notes') as string
  const fileUrl = formData.get('fileUrl') as string

  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.claimedById !== session.user.id) return

  // Create submission
  const submission = await prisma.taskSubmission.create({
    data: {
      taskId,
      userId: session.user.id,
      notes: notes || null,
      fileUrl: fileUrl || null,
      status: 'PENDING_AI',
    },
  })

  // Update task
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'AI_REVIEW',
      submittedAt: new Date(),
      currentAttempt: { increment: 1 },
    },
  })

  // Register content hash for IP protection
  const contentToHash = `${notes || ''}|${fileUrl || ''}|${taskId}|${session.user.id}`
  await registerContentHash('submission', submission.id, contentToHash, session.user.id)

  // Run mock AI review immediately (no more PENDING_AI forever)
  const aiResult = await runMockAiReview(submission.id, notes, fileUrl)

  // Update submission with AI results
  await prisma.taskSubmission.update({
    where: { id: submission.id },
    data: {
      aiScore: aiResult.score,
      aiFeedback: aiResult.feedback,
      status: aiResult.verdict,
    },
  })

  // Update task status based on AI verdict
  const newTaskStatus = aiResult.verdict === 'AI_APPROVED' ? 'HUMAN_REVIEW' : 'HUMAN_REVIEW'
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newTaskStatus,
      aiConfidenceScore: aiResult.score,
    },
  })

  // Notify user about AI review
  await createNotification(session.user.id, 'SUBMISSION_REVIEWED', `Revue IA terminée`, {
    body: `Score IA : ${aiResult.score}/100 — ${aiResult.verdict === 'AI_APPROVED' ? 'Approuvé' : 'En attente de revue humaine'}`,
    href: `/tasks/${taskId}`,
  })

  revalidatePath(`/tasks/${taskId}`)
  redirect(`/tasks/${taskId}`)
}

export async function abandonTaskAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const taskId = formData.get('taskId') as string
  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.claimedById !== session.user.id) return

  // Only allow abandoning if task is still CLAIMED (not submitted)
  if (task.status !== 'CLAIMED') return

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'AVAILABLE',
      claimedById: null,
      claimedAt: null,
      deadline: null,
    },
  })

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/tasks')
  redirect('/tasks')
}
