'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { checkAndUpgradeLevel } from '@/lib/level'
import { createNotification } from '@/lib/notifications'
import { runMockAiReview } from '@/lib/ai-review'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

// ─── Film Actions ──────────────────────────────────────────────

export async function createFilmAction(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const genre = formData.get('genre') as string
  const catalog = (formData.get('catalog') as string) || 'LUMIERE'
  const description = formData.get('description') as string
  const synopsis = formData.get('synopsis') as string
  const coverImageUrl = formData.get('coverImageUrl') as string
  const estimatedBudget = formData.get('estimatedBudget') as string
  const isPublic = formData.get('isPublic') === 'true'

  if (!title) return

  const slug = slugify(title)
  const existingSlug = await prisma.film.findUnique({ where: { slug } })
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

  await prisma.film.create({
    data: {
      title,
      slug: finalSlug,
      genre: genre || null,
      catalog: catalog as any,
      description: description || null,
      synopsis: synopsis || null,
      coverImageUrl: coverImageUrl || null,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      isPublic,
      phases: {
        create: [
          { phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
          { phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
          { phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
          { phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
          { phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
          { phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
          { phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
          { phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
          { phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
          { phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
        ],
      },
    },
  })

  revalidatePath('/admin/films')
  revalidatePath('/films')
  redirect('/admin/films')
}

export async function updateFilmAction(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const genre = formData.get('genre') as string
  const catalog = formData.get('catalog') as string
  const status = formData.get('status') as string
  const description = formData.get('description') as string
  const synopsis = formData.get('synopsis') as string
  const coverImageUrl = formData.get('coverImageUrl') as string
  const estimatedBudget = formData.get('estimatedBudget') as string
  const isPublic = formData.get('isPublic') === 'true'

  await prisma.film.update({
    where: { id },
    data: {
      title,
      genre: genre || null,
      catalog: catalog as any,
      status: status as any,
      description: description || null,
      synopsis: synopsis || null,
      coverImageUrl: coverImageUrl || null,
      estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
      isPublic,
    },
  })

  revalidatePath('/admin/films')
  revalidatePath('/films')
  redirect('/admin/films')
}

export async function deleteFilmAction(formData: FormData) {
  await requireAdmin()

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await prisma.film.delete({ where: { id: filmId } })

  revalidatePath('/admin/films')
  revalidatePath('/films')
}

// ─── Task Actions ──────────────────────────────────────────────

export async function createTaskAction(formData: FormData) {
  await requireAdmin()

  const filmId = formData.get('filmId') as string
  const phaseId = formData.get('phaseId') as string
  const title = formData.get('title') as string
  const descriptionMd = formData.get('descriptionMd') as string
  const instructionsMd = formData.get('instructionsMd') as string
  const type = formData.get('type') as string
  const difficulty = formData.get('difficulty') as string
  const priceEuros = parseFloat(formData.get('priceEuros') as string) || 50
  const status = (formData.get('status') as string) || 'AVAILABLE'
  const requiredLevel = (formData.get('requiredLevel') as string) || 'ROOKIE'

  if (!filmId || !phaseId || !title) return

  await prisma.$transaction([
    prisma.task.create({
      data: {
        filmId,
        phaseId,
        title,
        descriptionMd,
        instructionsMd: instructionsMd || null,
        type: type as any,
        difficulty: difficulty as any,
        priceEuros,
        status: status as any,
        requiredLevel: requiredLevel as any,
      },
    }),
    prisma.film.update({
      where: { id: filmId },
      data: { totalTasks: { increment: 1 } },
    }),
  ])

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  redirect('/admin/tasks')
}

export async function updateTaskAction(formData: FormData) {
  await requireAdmin()

  const taskId = formData.get('taskId') as string
  const title = formData.get('title') as string
  const descriptionMd = formData.get('descriptionMd') as string
  const instructionsMd = formData.get('instructionsMd') as string
  const type = formData.get('type') as string
  const difficulty = formData.get('difficulty') as string
  const priceEuros = parseFloat(formData.get('priceEuros') as string)
  const status = formData.get('status') as string
  const requiredLevel = formData.get('requiredLevel') as string
  const inputFilesUrlsRaw = formData.get('inputFilesUrls') as string

  if (!taskId) return

  const inputFilesUrls = inputFilesUrlsRaw
    ? inputFilesUrlsRaw.split('\n').map(u => u.trim()).filter(Boolean)
    : undefined

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title && { title }),
      ...(descriptionMd && { descriptionMd }),
      ...(instructionsMd !== null && { instructionsMd: instructionsMd || null }),
      ...(type && { type: type as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(priceEuros && { priceEuros }),
      ...(status && { status: status as any }),
      ...(requiredLevel && { requiredLevel: requiredLevel as any }),
      ...(inputFilesUrls && { inputFilesUrls }),
    },
  })

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)
}

export async function deleteTaskAction(formData: FormData) {
  await requireAdmin()

  const taskId = formData.get('taskId') as string
  if (!taskId) return

  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { filmId: true } })
  if (!task) return

  await prisma.$transaction([
    prisma.task.delete({ where: { id: taskId } }),
    prisma.film.update({
      where: { id: task.filmId },
      data: { totalTasks: { decrement: 1 } },
    }),
  ])

  revalidatePath('/admin/tasks')
  revalidatePath('/tasks')
}

export async function runAiReviewAction(formData: FormData) {
  await requireAdmin()

  const submissionId = formData.get('submissionId') as string
  if (!submissionId) return

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, notes: true, fileUrl: true, taskId: true, userId: true },
  })
  if (!submission) return

  const aiResult = await runMockAiReview(submission.id, submission.notes, submission.fileUrl)

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        aiScore: aiResult.score,
        aiFeedback: aiResult.feedback,
        status: aiResult.verdict,
      },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: 'HUMAN_REVIEW',
        aiConfidenceScore: aiResult.score,
      },
    }),
  ])

  await createNotification(submission.userId, 'SUBMISSION_REVIEWED', 'Revue IA terminée', {
    body: `Score IA : ${aiResult.score}/100 — ${aiResult.verdict === 'AI_APPROVED' ? 'Approuvé' : 'En attente de revue humaine'}`,
    href: `/tasks/${submission.taskId}`,
  })

  revalidatePath('/admin/reviews')
}

// ─── User Actions ──────────────────────────────────────────────

export async function verifyUserAction(formData: FormData) {
  await requireAdmin()
  const userId = formData.get('userId') as string
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true, verifiedAt: new Date() },
  })
  await createNotification(userId, 'SYSTEM', 'Compte vérifié', {
    body: 'Votre compte a été vérifié par un administrateur. Vous avez accès à toutes les fonctionnalités.',
    href: '/dashboard',
  })
  revalidatePath('/admin/users')
}

export async function changeUserRoleAction(formData: FormData) {
  await requireAdmin()
  const userId = formData.get('userId') as string
  const role = formData.get('role') as string
  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  })
  await createNotification(userId, 'SYSTEM', 'Rôle mis à jour', {
    body: `Votre rôle a été changé en ${role}.`,
    href: '/profile',
  })
  revalidatePath('/admin/users')
}

export async function grantLumensAction(formData: FormData) {
  await requireAdmin()

  const userId = formData.get('userId') as string
  const amountStr = formData.get('amount') as string
  const reason = formData.get('reason') as string
  const amount = parseInt(amountStr, 10)

  if (!userId || !amount || amount < 1) return

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { lumenBalance: { increment: amount } },
    }),
    prisma.lumenTransaction.create({
      data: {
        userId,
        amount,
        type: 'BONUS',
        description: reason || `Bonus de ${amount} Lumens attribué par un administrateur`,
      },
    }),
  ])

  await createNotification(userId, 'PAYMENT_RECEIVED', `${amount} Lumens reçus`, {
    body: reason || `Un administrateur vous a attribué ${amount} Lumens bonus.`,
    href: '/lumens',
  })

  revalidatePath('/admin/users')
}

// ─── Review Actions ────────────────────────────────────────────

export async function approveSubmissionAction(formData: FormData) {
  const session = await requireAdmin()
  const submissionId = formData.get('submissionId') as string
  const feedback = formData.get('feedback') as string

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  })
  if (!submission) return

  // Get settings for Lumen reward
  const settings = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } })
  const lumenReward = settings?.lumenRewardPerTask || 10

  // Calculate points
  const points = submission.task.priceEuros >= 500 ? 500 : submission.task.priceEuros >= 100 ? 100 : 50

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'HUMAN_APPROVED',
        humanReviewerId: session.user.id,
        humanFeedback: feedback || 'Approuvé par review humaine.',
      },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: 'VALIDATED',
        validatedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: submission.userId },
      data: {
        tasksCompleted: { increment: 1 },
        tasksValidated: { increment: 1 },
        points: { increment: points },
        lumenBalance: { increment: lumenReward },
      },
    }),
    prisma.film.update({
      where: { id: submission.task.filmId },
      data: { completedTasks: { increment: 1 } },
    }),
    // Create pending payment
    prisma.payment.upsert({
      where: { taskId: submission.taskId },
      create: {
        userId: submission.userId,
        taskId: submission.taskId,
        amountEur: submission.task.priceEuros,
        method: 'STRIPE',
        status: 'PENDING',
      },
      update: { status: 'PENDING' },
    }),
    // Record Lumen reward transaction
    prisma.lumenTransaction.create({
      data: {
        userId: submission.userId,
        amount: lumenReward,
        type: 'TASK_REWARD',
        description: `Récompense pour la tâche "${submission.task.title}"`,
        relatedId: submission.taskId,
      },
    }),
  ])

  // Notify user
  await createNotification(submission.userId, 'TASK_VALIDATED', 'Tâche validée', {
    body: `Votre soumission pour "${submission.task.title}" a été approuvée. +${points} points, +${lumenReward} Lumens.`,
    href: `/tasks/${submission.taskId}`,
  })

  // Check level upgrade
  const updatedUser = await prisma.user.findUnique({
    where: { id: submission.userId },
    select: { points: true },
  })
  if (updatedUser) {
    await checkAndUpgradeLevel(submission.userId, updatedUser.points)
  }

  revalidatePath('/admin/reviews')
}

export async function rejectSubmissionAction(formData: FormData) {
  const session = await requireAdmin()
  const submissionId = formData.get('submissionId') as string
  const feedback = formData.get('feedback') as string

  const submission = await prisma.taskSubmission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  })
  if (!submission) return

  const canRetry = submission.task.currentAttempt < submission.task.maxAttempts

  await prisma.$transaction([
    prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        humanReviewerId: session.user.id,
        humanFeedback: feedback,
      },
    }),
    prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: canRetry ? 'CLAIMED' : 'REJECTED',
      },
    }),
  ])

  await createNotification(submission.userId, 'TASK_REJECTED', 'Soumission refusée', {
    body: canRetry
      ? `Votre soumission pour "${submission.task.title}" a été refusée. Vous pouvez réessayer (tentative ${submission.task.currentAttempt}/${submission.task.maxAttempts}).`
      : `Votre soumission pour "${submission.task.title}" a été définitivement refusée.`,
    href: `/tasks/${submission.taskId}`,
  })

  revalidatePath('/admin/reviews')
}

// ─── Payment Actions ───────────────────────────────────────────

export async function markPaymentPaidAction(formData: FormData) {
  await requireAdmin()

  const paymentId = formData.get('paymentId') as string
  if (!paymentId) return

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { userId: true, amountEur: true },
  })
  if (!payment) return

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'COMPLETED', paidAt: new Date() },
  })

  await createNotification(payment.userId, 'PAYMENT_RECEIVED', 'Paiement effectué', {
    body: `Votre paiement de ${payment.amountEur.toFixed(2)}€ a été traité.`,
    href: '/profile/payments',
  })

  revalidatePath('/admin/payments')
}

export async function bulkMarkPaidAction(formData: FormData) {
  await requireAdmin()

  const paymentIdsRaw = formData.get('paymentIds') as string
  if (!paymentIdsRaw) return

  const paymentIds = paymentIdsRaw.split(',').filter(Boolean)
  if (paymentIds.length === 0) return

  const payments = await prisma.payment.findMany({
    where: { id: { in: paymentIds }, status: 'PENDING' },
    select: { id: true, userId: true, amountEur: true },
  })

  await prisma.payment.updateMany({
    where: { id: { in: payments.map(p => p.id) } },
    data: { status: 'COMPLETED', paidAt: new Date() },
  })

  // Notify each user
  for (const payment of payments) {
    await createNotification(payment.userId, 'PAYMENT_RECEIVED', 'Paiement effectué', {
      body: `Votre paiement de ${payment.amountEur.toFixed(2)}€ a été traité.`,
      href: '/profile/payments',
    })
  }

  revalidatePath('/admin/payments')
}

// ─── Admin TODO Actions ────────────────────────────────────────

export async function createAdminTodoAction(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = (formData.get('priority') as string) || 'MEDIUM'
  const dueAt = formData.get('dueAt') as string

  if (!title) return

  await prisma.adminTodo.create({
    data: {
      title,
      description: description || null,
      priority: priority as any,
      dueAt: dueAt ? new Date(dueAt) : null,
    },
  })

  revalidatePath('/admin')
}

export async function toggleTodoAction(formData: FormData) {
  await requireAdmin()

  const todoId = formData.get('todoId') as string
  if (!todoId) return

  const todo = await prisma.adminTodo.findUnique({ where: { id: todoId } })
  if (!todo) return

  await prisma.adminTodo.update({
    where: { id: todoId },
    data: { completed: !todo.completed },
  })

  revalidatePath('/admin')
}

export async function deleteTodoAction(formData: FormData) {
  await requireAdmin()

  const todoId = formData.get('todoId') as string
  if (!todoId) return

  await prisma.adminTodo.delete({ where: { id: todoId } })
  revalidatePath('/admin')
}

// ─── Settings Action ───────────────────────────────────────────

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin()

  const aiConfidenceThreshold = parseFloat(formData.get('aiConfidenceThreshold') as string) || 70
  const maxConcurrentTasks = parseInt(formData.get('maxConcurrentTasks') as string) || 3
  const bitcoinEnabled = formData.get('bitcoinEnabled') === 'true'
  const maintenanceMode = formData.get('maintenanceMode') === 'true'
  const lumenPrice = parseFloat(formData.get('lumenPrice') as string) || 1.0
  const lumenRewardPerTask = parseInt(formData.get('lumenRewardPerTask') as string) || 10
  const notifEmailEnabled = formData.get('notifEmailEnabled') === 'true'

  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      aiConfidenceThreshold,
      maxConcurrentTasks,
      bitcoinEnabled,
      maintenanceMode,
      lumenPrice,
      lumenRewardPerTask,
      notifEmailEnabled,
    },
    update: {
      aiConfidenceThreshold,
      maxConcurrentTasks,
      bitcoinEnabled,
      maintenanceMode,
      lumenPrice,
      lumenRewardPerTask,
      notifEmailEnabled,
    },
  })

  revalidatePath('/admin/settings')
}
