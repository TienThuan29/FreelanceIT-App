/**
 * Simple in-memory cache utility for API responses
 */

import performanceMonitor from './performance';

interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

class CacheService {
    private cache = new Map<string, CacheItem<any>>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

    /**
     * Set cache item with TTL
     */
    set<T>(key: string, data: T, ttl?: number): void {
        const now = Date.now();
        const expiresAt = now + (ttl || this.defaultTTL);
        
        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt,
        });
    }

    /**
     * Get cache item if not expired
     */
    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        
        if (!item) {
            performanceMonitor.recordCacheMiss();
            return null;
        }

        const now = Date.now();
        if (now > item.expiresAt) {
            // Cache expired, remove it
            this.cache.delete(key);
            performanceMonitor.recordCacheMiss();
            return null;
        }

        performanceMonitor.recordCacheHit();
        return item.data as T;
    }

    /**
     * Check if cache item exists and is valid
     */
    has(key: string): boolean {
        const item = this.cache.get(key);
        
        if (!item) {
            return false;
        }

        const now = Date.now();
        if (now > item.expiresAt) {
            // Cache expired, remove it
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Remove specific cache item
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Clear expired cache items
     */
    clearExpired(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache stats
     */
    getStats(): { totalItems: number; expiredItems: number } {
        const now = Date.now();
        let expiredItems = 0;

        for (const item of this.cache.values()) {
            if (now > item.expiresAt) {
                expiredItems++;
            }
        }

        return {
            totalItems: this.cache.size,
            expiredItems,
        };
    }
}

// Create singleton instance
const cacheService = new CacheService();

// Auto-cleanup expired items every minute
setInterval(() => {
    cacheService.clearExpired();
}, 60 * 1000);

export default cacheService;

/**
 * Cache key generators for different data types
 */
export const CacheKeys = {
    DEVELOPERS_LIST: (page: number, pageSize: number) => `developers_list_${page}_${pageSize}`,
    DEVELOPER_PROFILE: (userId: string) => `developer_profile_${userId}`,
    USER_PROFILE: (userId: string) => `user_profile_${userId}`,
} as const;
