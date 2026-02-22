'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveCreatorProfileAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const stageName = formData.get('stageName') as string
  const niche = formData.get('niche') as string
  const style = formData.get('style') as string || 'NOFACE'
  const bio = formData.get('bio') as string
  const toneOfVoice = formData.get('toneOfVoice') as string
  const avatarType = formData.get('avatarType') as string
  const voiceType = formData.get('voiceType') as string
  const publishFrequency = formData.get('publishFrequency') as string
  const automationLevel = formData.get('automationLevel') as string || 'ASSISTED'
  const step = parseInt(formData.get('step') as string || '0', 10)

  if (!stageName && step >= 3) {
    return { error: 'Nom de scène requis' }
  }

  await prisma.creatorProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      stageName,
      niche,
      style: style as 'FACE' | 'NOFACE' | 'HYBRID',
      bio,
      toneOfVoice,
      avatarType,
      voiceType,
      publishFrequency,
      automationLevel: automationLevel as 'AUTO' | 'ASSISTED' | 'EXPERT',
      wizardCompleted: step >= 7,
    },
    update: {
      stageName: stageName || undefined,
      niche: niche || undefined,
      style: style as 'FACE' | 'NOFACE' | 'HYBRID',
      bio: bio || undefined,
      toneOfVoice: toneOfVoice || undefined,
      avatarType: avatarType || undefined,
      voiceType: voiceType || undefined,
      publishFrequency: publishFrequency || undefined,
      automationLevel: automationLevel as 'AUTO' | 'ASSISTED' | 'EXPERT',
      wizardCompleted: step >= 7 ? true : undefined,
    },
  })

  revalidatePath('/creator')
  return { success: true }
}

export async function generateVideoAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return { error: 'Profil créateur requis. Complétez le wizard.' }

  const title = formData.get('title') as string
  const script = formData.get('script') as string
  const platforms = formData.getAll('platforms') as string[]

  if (!title) return { error: 'Titre requis' }

  // Check token balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lumenBalance: true },
  })

  const cost = 10 // TOKEN_COSTS.VIDEO_GEN_STANDARD
  if ((user?.lumenBalance || 0) < cost) {
    return { error: `Solde insuffisant. Coût : ${cost} tokens.` }
  }

  // Create video record (in GENERATING state — actual generation would be async)
  await prisma.generatedVideo.create({
    data: {
      profileId: profile.id,
      title,
      script,
      platforms,
      status: 'GENERATING',
      tokensSpent: cost,
    },
  })

  // Deduct tokens
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lumenBalance: { decrement: cost } },
  })

  await prisma.lumenTransaction.create({
    data: {
      userId: session.user.id,
      amount: -cost,
      type: 'VIDEO_GEN',
      description: `Génération vidéo : ${title}`,
    },
  })

  revalidatePath('/creator/videos')
  return { success: true }
}

export async function deleteVideoAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const videoId = formData.get('videoId') as string
  if (!videoId) return

  const video = await prisma.generatedVideo.findUnique({
    where: { id: videoId },
    include: { profile: { select: { userId: true } } },
  })

  if (!video || video.profile.userId !== session.user.id) return

  await prisma.generatedVideo.delete({ where: { id: videoId } })
  revalidatePath('/creator/videos')
}

export async function connectSocialAccountAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const platform = formData.get('platform') as string
  const handle = formData.get('handle') as string

  if (!platform || !handle) return { error: 'Plateforme et identifiant requis' }

  await prisma.socialAccount.upsert({
    where: { userId_platform: { userId: session.user.id, platform: platform as any } },
    create: {
      userId: session.user.id,
      platform: platform as any,
      handle,
    },
    update: { handle },
  })

  revalidatePath('/creator/accounts')
  return { success: true }
}
