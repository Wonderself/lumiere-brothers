import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://creators.lumiere.film'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/streaming`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/films`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/actors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/community/contests`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/community/scenarios`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/login`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic pages — wrapped in try/catch for resilience
  let filmPages: MetadataRoute.Sitemap = []
  let catalogFilmPages: MetadataRoute.Sitemap = []
  let actorPages: MetadataRoute.Sitemap = []

  try {
    // Production films (public)
    const films = await prisma.film.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
    })
    filmPages = films.map((film) => ({
      url: `${baseUrl}/films/${film.slug}`,
      lastModified: film.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not available
  }

  try {
    // Catalog films (streaming — LIVE only)
    const catalogFilms = await prisma.catalogFilm.findMany({
      where: { status: 'LIVE' },
      select: { slug: true, updatedAt: true },
    })
    catalogFilmPages = catalogFilms.map((film) => ({
      url: `${baseUrl}/streaming/${film.slug}`,
      lastModified: film.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // DB not available
  }

  try {
    // Active actors
    const actors = await prisma.aIActor.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
    actorPages = actors.map((actor) => ({
      url: `${baseUrl}/actors/${actor.slug}`,
      lastModified: actor.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch {
    // DB not available
  }

  return [...staticPages, ...filmPages, ...catalogFilmPages, ...actorPages]
}
