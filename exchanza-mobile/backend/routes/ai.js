import express from "express";
import OpenAI from "openai";

const router = express.Router();
router.post("/generate-trade-insight", async (req, res) => {
  try {

    const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

    const { offerText, requestText, postTitle } = req.body;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: `
            Analyze this trade proposal.

            Post Title:
            ${postTitle}

            Offer:
            ${offerText}

            Request:
            ${requestText}

            Return ONLY valid JSON:

            {
              "summary": "",
              "fairness": "",
              "risk": "",
              "note": ""
            }

            Keep responses short.
          `,
        },
      ],
    });

    const response = completion.choices[0].message.content;

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    res.json(parsed);


  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to generate insight",
    });
  }
});

export default router;