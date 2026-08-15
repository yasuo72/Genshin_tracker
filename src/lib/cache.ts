import { Redis } from "@upstash/redis";

// Initialize Upstash Redis if credentials are provided
let redis: Redis | null = null;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// In-memory fallback cache with TTL
interface MemoryCacheEntry<T> {
  value: T;
  expiresAt: number;
}
const memoryCache = new Map<string, MemoryCacheEntry<unknown>>();

/**
 * In-memory in-flight request deduplication map.
 * Ensures concurrent requests for the same key share a single execution.
 */
const inFlightPromises = new Map<string, Promise<unknown>>();

export async function deduplicate<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  if (inFlightPromises.has(key)) {
    return inFlightPromises.get(key) as Promise<T>;
  }

  const promise = fetcher().finally(() => {
    inFlightPromises.delete(key);
  });

  inFlightPromises.set(key, promise);
  return promise;
}

/**
 * Retrieve cached item by key
 */
export async function getCached<T>(key: string): Promise<T | null> {
  // Try Redis first if configured
  if (redis) {
    try {
      const data = await redis.get<T>(key);
      if (data !== null && data !== undefined) {
        return data;
      }
    } catch (err) {
      console.warn(`[cache] Redis get failed for key "${key}", falling back to memory:`, err);
    }
  }

  // Check in-memory cache
  const entry = memoryCache.get(key);
  if (entry) {
    if (Date.now() < entry.expiresAt) {
      return entry.value as T;
    }
    memoryCache.delete(key);
  }

  return null;
}

/**
 * Store item in cache with TTL in seconds
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const safeTtl = Math.max(1, ttlSeconds);

  // Store in Redis if available
  if (redis) {
    try {
      await redis.set(key, value, { ex: safeTtl });
    } catch (err) {
      console.warn(`[cache] Redis set failed for key "${key}":`, err);
    }
  }

  // Store in memory cache
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + safeTtl * 1000,
  });
}
