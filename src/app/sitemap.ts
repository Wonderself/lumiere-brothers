import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://lumiere.film'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/films`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Dynamic film pages
  let filmPages: MetadataRoute.Sitemap = []
  try {
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
    // DB not available — return static pages only
  }

  return [...staticPages, ...filmPages]
}
