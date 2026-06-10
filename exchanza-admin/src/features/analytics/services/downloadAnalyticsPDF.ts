/* eslint-disable @typescript-eslint/no-explicit-any */
import html2canvas from "html2canvas";

const wait = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

const captureChart = async (id: string) => {

    const element = document.getElementById(id);

    if (!element) return "";

    await wait(800);

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: true,
        scrollX: 0,
        scrollY: -window.scrollY,
    });

    return canvas.toDataURL(
        "image/png",
        0.75
    );
};

const captureWithDelay = async (id: string) => {
    const result = await captureChart(id);
    await wait(300);
    return result;
};

export const downloadAnalyticsPDF = async ({
    overview,
    topUsers,
    topTags,
    avgCompletionTime,
    showToast
}: any) => {

    try {

        document.body.classList.add("pdf-export");

        await document.fonts.ready;

        await wait(3500);

        // CAPTURE
        const tradeChart = await captureWithDelay("trade-chart");

        const growthChart = await captureWithDelay("growth-chart");

        const completionChart = await captureWithDelay("completion-chart");

        const activityChart = await captureWithDelay("activity-chart");

        const weeklyChart = await captureWithDelay("weekly-chart");

        const radarChart = await captureWithDelay("radar-chart");

        const funnelChart = await captureWithDelay("funnel-chart");

        const scatterChart = await captureWithDelay("scatter-chart");

        const heatmapChart = await captureWithDelay("heatmap-chart");

        // SEND
        const response = await fetch(
            "https://exchanza-pdf-server.onrender.com/api/pdf/analytics",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    overview,
                    topUsers,
                    topTags,
                    avgCompletionTime,
                    adminName: "Admin",

                    charts: {
                        tradeChart,
                        growthChart,
                        completionChart,
                        activityChart,
                        weeklyChart,
                        radarChart,
                        funnelChart,
                        scatterChart,
                        heatmapChart,
                    },
                }),
            }
        );

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a =  document.createElement("a");

        a.href = url;

        a.download = "exchanza-analytics-report.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);

        document.body.classList.remove("pdf-export");

        showToast(
            "Analytics Report Downloaded",
            "success"
        );

    } catch (error) {

        console.log("PDF Download Error.", error);
        document.body.classList.remove("pdf-export");
    }
};