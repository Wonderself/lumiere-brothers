'use server'

import { prisma } from '@/lib/prisma'
import { auth, signIn } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  displayName: z.string().min(2, 'Minimum 2 caractères'),
  role: z.enum(['CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'VIEWER', 'SCREENWRITER']).default('CONTRIBUTOR'),
  portfolioUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
})

export type RegisterFormState = {
  error?: string
  success?: boolean
}

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    displayName: formData.get('displayName') as string,
    role: (formData.get('role') as string) || 'CONTRIBUTOR',
    portfolioUrl: formData.get('portfolioUrl') as string,
    skills: formData.getAll('skills') as string[],
    languages: formData.getAll('languages') as string[],
  }

  const parsed = registerSchema.safeParse(rawData)
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]
    return { error: firstError?.message ?? 'Données invalides.' }
  }

  const { email, password, displayName, role, portfolioUrl, skills, languages } = parsed.data

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return { error: 'Un compte existe déjà avec cet email.' }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        displayName,
        role: role as any,
        portfolioUrl: portfolioUrl || null,
        skills: skills || [],
        languages: languages || [],
        isVerified: false,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Une erreur est survenue. Veuillez réessayer.' }
  }
}

export async function loginAction(
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error: any) {
    if (error?.message?.includes('CredentialsSignin') || error?.type === 'CredentialsSignin') {
      return { error: 'Email ou mot de passe incorrect.' }
    }
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    return { error: 'Une erreur est survenue.' }
  }

  return {}
}

// ─── Forgot Password ──────────────────────────────────────────

export async function forgotPasswordAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) return { error: 'Veuillez entrer votre email.' }

  const user = await prisma.user.findUnique({ where: { email } })

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true }
  }

  // Generate token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)

  // Delete existing reset tokens for this user
  await prisma.passwordReset.deleteMany({ where: { userId: user.id } })

  // Create new reset token
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  })

  // In production, send email via Resend/SendGrid
  // For now, log the reset link
  console.log(`[RESET PASSWORD] Token for ${email}: ${token}`)
  console.log(`[RESET PASSWORD] Link: /reset-password?token=${token}`)

  return { success: true }
}

// ─── Reset Password ───────────────────────────────────────────

export async function resetPasswordAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!token) return { error: 'Token manquant.' }
  if (!password || password.length < 8) return { error: 'Minimum 8 caractères.' }
  if (password !== confirmPassword) return { error: 'Les mots de passe ne correspondent pas.' }

  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!resetRecord) return { error: 'Lien invalide ou expiré.' }
  if (resetRecord.usedAt) return { error: 'Ce lien a déjà été utilisé.' }
  if (resetRecord.expiresAt < new Date()) return { error: 'Ce lien a expiré. Demandez un nouveau lien.' }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { success: true }
}

// ─── Update Profile ───────────────────────────────────────────

const profileSchema = z.object({
  displayName: z.string().min(2, 'Minimum 2 caractères').max(50),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  portfolioUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  walletAddress: z.string().max(100).optional().or(z.literal('')),
})

export async function updateProfileAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const rawData = {
    displayName: formData.get('displayName') as string,
    bio: formData.get('bio') as string,
    avatarUrl: formData.get('avatarUrl') as string,
    portfolioUrl: formData.get('portfolioUrl') as string,
    skills: formData.getAll('skills') as string[],
    languages: formData.getAll('languages') as string[],
    walletAddress: formData.get('walletAddress') as string,
  }

  const parsed = profileSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Données invalides' }
  }

  const { displayName, bio, avatarUrl, portfolioUrl, skills, languages, walletAddress } = parsed.data

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      displayName,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      portfolioUrl: portfolioUrl || null,
      skills: skills || [],
      languages: languages || [],
      walletAddress: walletAddress || null,
    },
  })

  revalidatePath('/profile')
  return { success: true }
}
