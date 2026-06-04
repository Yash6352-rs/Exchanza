import { getDashboardStats, getRecentReports } from "./dashboardService";

/* eslint-disable @typescript-eslint/no-explicit-any */
let dashboardCache: any = null
let reportsCache: any[] = []
let lastFetch = 0

const CACHE_TIME = 1000 * 60 * 5 // 5 min

export async function getCachedDashboardData() {

  const now = Date.now()

  // USE CACHE
  if (dashboardCache && now - lastFetch < CACHE_TIME) {
    return {
      stats: dashboardCache,
      reports: reportsCache
    }
  }

  // FETCH NEW
  const statsData = await getDashboardStats()
  const reportsData = await getRecentReports()

  dashboardCache = statsData
  reportsCache = reportsData
  lastFetch = now

  return {
    stats: statsData,
    reports: reportsData
  }
}