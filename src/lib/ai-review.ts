import { prisma } from '@/lib/prisma'

interface AiReviewResult {
  score: number
  feedback: string
  verdict: 'AI_APPROVED' | 'AI_FLAGGED'
}

// Deterministic hash to number (0-1) based on submission ID
function hashToNumber(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash % 1000) / 1000
}

const FEEDBACK_TEMPLATES = {
  excellent: [
    'Excellent travail ! La qualité est remarquable et répond parfaitement aux attentes du projet.',
    'Soumission de très haute qualité. Les détails sont soignés et le résultat est professionnel.',
    'Travail exceptionnel. La créativité et la précision sont au rendez-vous.',
  ],
  good: [
    'Bon travail dans l\'ensemble. Quelques ajustements mineurs pourraient améliorer le résultat.',
    'La soumission est de bonne qualité. Le travail est soigné avec quelques points à peaufiner.',
    'Résultat satisfaisant. La direction artistique est bien respectée.',
  ],
  average: [
    'Le travail est acceptable mais nécessite des améliorations. Vérifiez les consignes détaillées.',
    'Qualité moyenne. Certains éléments ne correspondent pas entièrement au brief.',
    'Des progrès sont nécessaires sur certains aspects. Revoyez les instructions du projet.',
  ],
  poor: [
    'Le travail ne répond pas aux critères de qualité requis. Veuillez revoir les instructions.',
    'Soumission en dessous des attentes. Les consignes principales n\'ont pas été suivies.',
    'Qualité insuffisante pour validation. Un travail plus approfondi est nécessaire.',
  ],
}

export async function runMockAiReview(
  submissionId: string,
  notes: string | null,
  fileUrl: string | null
): Promise<AiReviewResult> {
  // Deterministic base score from submission ID
  const baseHash = hashToNumber(submissionId)
  let score = 50 + Math.floor(baseHash * 45) // Range: 50-95

  // Bonus for detailed notes
  if (notes && notes.length > 100) score = Math.min(score + 5, 98)
  if (notes && notes.length > 200) score = Math.min(score + 3, 98)

  // Bonus for file attachment
  if (fileUrl) score = Math.min(score + 8, 98)

  // Penalty for very short notes
  if (!notes || notes.length < 20) score = Math.max(score - 15, 30)

  // Get threshold from admin settings
  let threshold = 70
  try {
    const settings = await prisma.adminSettings.findUnique({
      where: { id: 'singleton' },
    })
    if (settings) threshold = settings.aiConfidenceThreshold
  } catch {
    // Use default threshold
  }

  // Select feedback based on score bracket
  let feedbackCategory: keyof typeof FEEDBACK_TEMPLATES
  if (score >= 85) feedbackCategory = 'excellent'
  else if (score >= 70) feedbackCategory = 'good'
  else if (score >= 55) feedbackCategory = 'average'
  else feedbackCategory = 'poor'

  const templates = FEEDBACK_TEMPLATES[feedbackCategory]
  const feedbackIndex = Math.floor(hashToNumber(submissionId + 'feedback') * templates.length)
  const feedback = templates[feedbackIndex]

  const verdict = score >= threshold ? 'AI_APPROVED' : 'AI_FLAGGED'

  return { score, feedback, verdict }
}
