export const generateTradeInsight = async ({
  postTitle,
  offerText,
  requestText,
}: {
  postTitle: string;
  offerText: string;
  requestText: string;
}) => {
  try {
    const response = await fetch(
        "http://192.168.1.213:5000/api/ai/generate-trade-insight",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postTitle,
          offerText,
          requestText,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("AI Insight Error:", error);

    return {
      summary: "Unable to analyze trade",
      fairness: "Unknown",
      risk: "Unknown",
      note: "AI service unavailable",
    };
  }
};


