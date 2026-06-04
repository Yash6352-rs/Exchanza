import { getAnalyticsOverview, getAverageCompletionTime, getGrowthAnalytics, getTopTags, getTopUsers, getTradeAnalytics } from "./analyticsService";

/* eslint-disable @typescript-eslint/no-explicit-any */
let analyticsCache: any = null;
let analyticsLastFetch = 0;

let avgCompletionCache = '';

const CACHE_TIME = 1000 * 60 * 5 // 5 mins

export async function getCachedAnalytics(range: string) {

    const now = Date.now();

    // USE CACHE
    if (analyticsCache && analyticsCache.range === range && now - analyticsLastFetch < CACHE_TIME) {
        return analyticsCache;
    }

    // CACHE AVG TIME
    if (!avgCompletionCache) {
        avgCompletionCache = await getAverageCompletionTime();
    }

    // FETCH
    const [
        overview, tradeData, growthData, topUsers, topTags
    ] = await Promise.all([
        getAnalyticsOverview(),
        getTradeAnalytics(),
        getGrowthAnalytics(range),
        getTopUsers(),
        getTopTags()
    ]);

    analyticsCache = {
        overview, tradeData, growthData, avgCompletionTime: avgCompletionCache, topUsers, topTags, range
    }

    analyticsLastFetch = now;
    
    return analyticsCache;
}