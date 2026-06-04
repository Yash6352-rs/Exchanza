import { createAnalyticsSnapshot } from "../../analytics/services/analyticsSnapshots";
import { syncDashboardStats } from "./dashboardService";

let isSyncing = false;

export const runBackgroundStatsSync = async () => {
    if (isSyncing) return;

    try {
        isSyncing = true;

        await syncDashboardStats();
        await createAnalyticsSnapshot();

    } catch (error) {
        console.log(error);
    } finally {
        isSyncing = false;
    }
}