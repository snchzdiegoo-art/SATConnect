/**
 * SAT Connect - OTA Settings Cache
 * In-memory cache with TTL to reduce database load
 */

import { prisma } from '@/lib/prisma';
import type { GlobalOTASetting } from '@/lib/types/api';

// Cache state
let cachedSettings: GlobalOTASetting[] | null = null;
let cacheTimestamp: number = 0;

// Cache TTL: 5 minutes (300,000 ms)
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Get OTA settings with caching
 * Returns cached data if fresh, otherwise fetches from database
 */
export async function getOTASettings(): Promise<GlobalOTASetting[]> {
    const now = Date.now();

    // Check if cache is valid
    if (cachedSettings && (now - cacheTimestamp) < CACHE_TTL_MS) {
        console.log('[OTA Cache] ✅ Cache HIT - serving from memory');
        return cachedSettings;
    }

    console.log('[OTA Cache] ❌ Cache MISS - fetching from database');

    // Fetch from database
    const settings = await prisma.globalOTASettings.findMany({
        orderBy: { channel_name: 'asc' }
    });

    // Convert Prisma Decimal to number for JSON serialization
    const normalizedSettings: GlobalOTASetting[] = settings.map(s => ({
        id: s.id,
        channel_key: s.channel_key,
        channel_name: s.channel_name,
        default_commission: Number(s.default_commission),
        is_active: s.is_active,
    }));

    // Update cache
    cachedSettings = normalizedSettings;
    cacheTimestamp = now;

    console.log(`[OTA Cache] 📦 Cached ${settings.length} OTA settings`);

    return normalizedSettings;
}

/**
 * Invalidate the cache
 * Should be called when OTA settings are created/updated
 */
export function invalidateOTACache(): void {
    cachedSettings = null;
    cacheTimestamp = 0;
    console.log('[OTA Cache] 🔄 Cache invalidated');
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats() {
    const now = Date.now();
    const age = cachedSettings ? now - cacheTimestamp : null;
    const ttlRemaining = age ? Math.max(0, CACHE_TTL_MS - age) : null;

    return {
        isCached: cachedSettings !== null,
        cacheAge: age,
        ttlRemaining,
        entriesCount: cachedSettings?.length ?? 0,
    };
}
