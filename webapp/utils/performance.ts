/**
 * Performance monitoring utilities for cache and API calls
 */

interface PerformanceMetrics {
    cacheHits: number;
    cacheMisses: number;
    apiCalls: number;
    averageResponseTime: number;
}

class PerformanceMonitor {
    private metrics: PerformanceMetrics = {
        cacheHits: 0,
        cacheMisses: 0,
        apiCalls: 0,
        averageResponseTime: 0,
    };

    private responseTimes: number[] = [];

    /**
     * Record a cache hit
     */
    recordCacheHit(): void {
        this.metrics.cacheHits++;
        console.log(`Cache hit! Total hits: ${this.metrics.cacheHits}`);
    }

    /**
     * Record a cache miss
     */
    recordCacheMiss(): void {
        this.metrics.cacheMisses++;
        console.log(`Cache miss! Total misses: ${this.metrics.cacheMisses}`);
    }

    /**
     * Record an API call with response time
     */
    recordApiCall(responseTime: number): void {
        this.metrics.apiCalls++;
        this.responseTimes.push(responseTime);
        
        // Calculate average response time
        const totalTime = this.responseTimes.reduce((sum, time) => sum + time, 0);
        this.metrics.averageResponseTime = totalTime / this.responseTimes.length;
        
        console.log(`API call completed in ${responseTime}ms. Average: ${this.metrics.averageResponseTime.toFixed(2)}ms`);
    }

    /**
     * Get current metrics
     */
    getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    /**
     * Get cache hit rate
     */
    getCacheHitRate(): number {
        const total = this.metrics.cacheHits + this.metrics.cacheMisses;
        return total > 0 ? (this.metrics.cacheHits / total) * 100 : 0;
    }

    /**
     * Reset metrics
     */
    reset(): void {
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            apiCalls: 0,
            averageResponseTime: 0,
        };
        this.responseTimes = [];
    }

    /**
     * Log performance summary
     */
    logSummary(): void {
        const hitRate = this.getCacheHitRate();
        console.log('=== Performance Summary ===');
        console.log(`Cache Hit Rate: ${hitRate.toFixed(2)}%`);
        console.log(`Total API Calls: ${this.metrics.apiCalls}`);
        console.log(`Average Response Time: ${this.metrics.averageResponseTime.toFixed(2)}ms`);
        console.log('===========================');
    }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

/**
 * Utility function to measure async function execution time
 */
export const measureAsync = async <T>(
    fn: () => Promise<T>,
    label?: string
): Promise<T> => {
    const start = performance.now();
    try {
        const result = await fn();
        const end = performance.now();
        const duration = end - start;
        
        if (label) {
            console.log(`${label} completed in ${duration.toFixed(2)}ms`);
        }
        
        performanceMonitor.recordApiCall(duration);
        return result;
    } catch (error) {
        const end = performance.now();
        const duration = end - start;
        
        if (label) {
            console.log(`${label} failed after ${duration.toFixed(2)}ms`);
        }
        
        performanceMonitor.recordApiCall(duration);
        throw error;
    }
};
