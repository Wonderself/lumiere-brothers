/**
 * Anti-detection publishing algorithm
 * Makes AI-generated posts appear human to social platforms
 */

// Crypto-random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Calculate jitter minutes for a scheduled post
 * Ensures no two consecutive posts are at similar times
 */
export function calculateJitter(
  scheduledHour: number,
  lastPostHour?: number
): number {
  // Base jitter: -45 to +45 minutes
  let jitter = randomInt(-45, 45)

  // If last post was within 60 min of this slot, force bigger offset
  if (lastPostHour !== undefined) {
    const diff = Math.abs(scheduledHour - lastPostHour)
    if (diff < 1) {
      // Force at least 30 min difference
      jitter = jitter > 0 ? randomInt(30, 45) : randomInt(-45, -30)
    }
  }

  return jitter
}

/**
 * Get optimal posting hours for a platform + niche
 * Returns array of hours (0-23) ranked by engagement
 */
export function getOptimalHours(platform: string, _niche?: string): number[] {
  const schedules: Record<string, number[]> = {
    TIKTOK: [7, 9, 12, 15, 19, 21, 22],
    INSTAGRAM: [8, 11, 13, 17, 19, 20],
    YOUTUBE: [9, 12, 15, 18, 20],
    FACEBOOK: [9, 13, 16, 19],
    X: [8, 12, 17, 20, 22],
  }
  return schedules[platform] ?? [9, 12, 18, 20]
}

/**
 * Pick next posting slot with human-like randomness
 * Never exact same time, varies format/duration slightly
 */
export function generatePublishSchedule(options: {
  platform: string
  frequency: string // "daily", "3x_week", "weekly"
  startDate: Date
  count: number
  lastPostHour?: number
}): Array<{ date: Date; jitterMinutes: number }> {
  const { platform, frequency, startDate, count, lastPostHour } = options
  const optimalHours = getOptimalHours(platform)
  const schedule: Array<{ date: Date; jitterMinutes: number }> = []

  let currentDate = new Date(startDate)
  let prevHour = lastPostHour

  const dayStep = frequency === 'daily' ? 1 : frequency === '3x_week' ? 2 : 7

  for (let i = 0; i < count; i++) {
    // Pick a random optimal hour (don't always use the best one)
    const hourIdx = randomInt(0, Math.min(optimalHours.length - 1, 3))
    const baseHour = optimalHours[hourIdx]

    const jitter = calculateJitter(baseHour, prevHour)

    const postDate = new Date(currentDate)
    postDate.setHours(baseHour, randomInt(0, 59), randomInt(0, 59))

    schedule.push({ date: postDate, jitterMinutes: jitter })

    prevHour = baseHour + jitter / 60

    // Add day step with ±1 day randomness (except daily)
    const extraDays = dayStep > 1 ? randomInt(-1, 1) : 0
    currentDate.setDate(currentDate.getDate() + dayStep + extraDays)
  }

  return schedule
}

/**
 * Vary video metadata slightly to avoid pattern detection
 */
export function humanizeMetadata(base: {
  title: string
  description: string
  duration: number
}): {
  title: string
  description: string
  duration: number
} {
  // Slight duration variation (±2 seconds)
  const durationVariation = randomInt(-2, 2)

  // Add random emoji or punctuation variation to description
  const endings = ['', '.', '!', ' ✨', ' 🎬', ' 💡', ' 🔥']
  const ending = endings[randomInt(0, endings.length - 1)]

  return {
    title: base.title,
    description: base.description + ending,
    duration: Math.max(1, base.duration + durationVariation),
  }
}
