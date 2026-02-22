// Redis cache with graceful degradation (works without Redis running)

let redis: any = null

async function getRedisClient() {
  if (redis) return redis
  if (!process.env.REDIS_URL) return null

  try {
    const { default: Redis } = await import('ioredis')
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Don't retry — fallback to DB
      lazyConnect: true,
    })
    await redis.connect()
    return redis
  } catch {
    return null
  }
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  try {
    const client = await getRedisClient()
    if (client) {
      const cached = await client.get(`lumiere:${key}`)
      if (cached) return JSON.parse(cached) as T
    }

    const data = await fetcher()

    try {
      const client = await getRedisClient()
      if (client) {
        await client.set(`lumiere:${key}`, JSON.stringify(data), 'EX', ttlSeconds)
      }
    } catch {
      // Cache write failed — continue without caching
    }

    return data
  } catch {
    // Redis completely unavailable — just fetch directly
    return fetcher()
  }
}

export async function invalidateCache(pattern: string) {
  try {
    const client = await getRedisClient()
    if (!client) return
    const keys = await client.keys(`lumiere:${pattern}`)
    if (keys.length > 0) await client.del(...keys)
  } catch {
    // Ignore cache invalidation errors
  }
}
