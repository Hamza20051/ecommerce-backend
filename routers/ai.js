const express = require("express");
const groq = require("../config/groq");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

/* ==============================
   🔥 RATE LIMIT (IMPORTANT)
================================ */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per minute
});

/* ==============================
   💍 AI CHAT (Jewelry Advisor)
================================ */
router.post("/chat", aiLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    // validation
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // fetch relevant products (lightweight)
    const products = await Product.find({})
      .select("name category price materials colors description")
      .limit(10);

    // optimized context (cheap tokens)
    const productContext = products
      .map(
        (p) =>
          `${p.name} | ${p.category} | $${p.price} | ${p.materials?.join(",")} | ${p.colors?.join(",")}`
      )
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a professional luxury jewelry advisor.

RULES:
- Recommend ONLY products from given list
- NEVER invent products
- If not found, say "not available in store"
- Ask user for budget/style if unclear
- Suggest matching jewelry combinations
- Keep answers elegant, short, persuasive

TONE:
Luxury, friendly, sales advisor
          `,
        },
        {
          role: "user",
          content: `
Customer Question: ${message}

Available Jewelry:
${productContext}

Only use these products for recommendations.
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    res.json({
      reply:
        completion?.choices?.[0]?.message?.content ||
        "No response from AI",
    });

  } catch (error) {
    console.error("❌ AI Chat Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
});

/* ==============================
   💍 AI DESCRIPTION (ADMIN ONLY)
================================ */
router.post(
  "/generate-description",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { name, category } = req.body;

      if (!name || !category) {
        return res
          .status(400)
          .json({ error: "Name and category are required" });
      }

      const prompt = `
Write a premium jewelry product description.

Format:
Description:
Style:
Occasion:
Why Special:

Product Name: ${name}
Category: ${category}

Tone: Elegant, luxury, persuasive, customer-friendly.
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 400,
      });

      res.json({
        description:
          completion?.choices?.[0]?.message?.content ||
          "No description generated",
      });

    } catch (err) {
      console.error("❌ AI Description Error:", err);
      res.status(500).json({ error: "Description generation failed" });
    }
  }
);

module.exports = router;
