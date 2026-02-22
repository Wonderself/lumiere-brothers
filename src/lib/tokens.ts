/**
 * Centralized token pricing middleware
 * All token costs are defined here — single source of truth
 */

export const TOKEN_COSTS = {
  VIDEO_GEN_STANDARD: 10,
  VIDEO_GEN_4K: 25,
  CLONE_VOICE: 50,
  PUBLISH_MULTI: 5,      // per platform
  OUTREACH: 3,           // per contact
  ANALYTICS_PRO: 30,     // per month
  AB_TEST: 8,            // per variant
  VIDEO_EXTRA_30S: 5,    // per 30 sec block
  REGEN_MODIFY: 5,
  WATERMARK_REMOVE: 15,  // per month
} as const

export const TOKEN_PACKS = [
  { id: 'starter', name: 'Starter', price: 4.99, tokens: 50, bonus: 0 },
  { id: 'creator', name: 'Creator', price: 14.99, tokens: 200, bonus: 33 },
  { id: 'pro', name: 'Pro', price: 39.99, tokens: 600, bonus: 50 },
  { id: 'business', name: 'Business', price: 99.99, tokens: 2000, bonus: 100 },
] as const

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 0,
    tokensPerMonth: 0,
    tokensOneTime: 50,
    features: ['3 vidéos/mois', 'Watermark', 'Publicité', 'Analytics 7 jours', '1 plateforme'],
    limits: { videosPerMonth: 3, platforms: 1, analyticsDays: 7, hasWatermark: true, hasAds: true },
  },
  {
    id: 'starter' as const,
    name: 'Starter',
    price: 9.99,
    tokensPerMonth: 100,
    tokensOneTime: 0,
    features: ['Sans pub', '10 vidéos/mois', 'Analytics 30 jours', '3 plateformes', 'Support email'],
    limits: { videosPerMonth: 10, platforms: 3, analyticsDays: 30, hasWatermark: true, hasAds: false },
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 29.99,
    tokensPerMonth: 400,
    tokensOneTime: 0,
    features: ['Illimité', 'Multi-plateforme', 'Sans watermark', 'Analytics complet', 'A/B testing', 'Support prioritaire'],
    limits: { videosPerMonth: -1, platforms: 5, analyticsDays: 365, hasWatermark: false, hasAds: false },
    recommended: true,
  },
  {
    id: 'business' as const,
    name: 'Business',
    price: 79.99,
    tokensPerMonth: 1500,
    tokensOneTime: 0,
    features: ['Tout Pro +', 'API accès', 'White-label', 'Multi-utilisateurs', 'Account manager dédié'],
    limits: { videosPerMonth: -1, platforms: 5, analyticsDays: 365, hasWatermark: false, hasAds: false },
  },
] as const

export const STREAK_BONUS = {
  days: 7,
  tokens: 20,
} as const

export const REFERRAL_BONUS = {
  referrer: 30,
  referred: 30,
  recurringPct: 10, // 10% commission on filleul's token purchases
} as const

export type TokenCostKey = keyof typeof TOKEN_COSTS
