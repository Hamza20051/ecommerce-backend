const express = require("express");
const groq = require("../config/groq");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* ==============================
   💍 AI CHAT (Jewelry Advisor)
================================ */
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch products
    const products = await Product.find().limit(10);

    // Build jewelry-focused context
    const productContext = products
      .map(
        (p) =>
          `Product: ${p.name}, Category: ${p.category}, Price: ${p.price}, Materials: ${p.materials}, Colors: ${p.colors}, Description: ${p.description}`
      )
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a professional jewelry advisor for an online jewelry store.

Rules:
- Help customers choose jewelry based on occasion (wedding, party, daily wear, gift)
- Ask about preferences if missing (style, color, material, budget)
- Recommend products ONLY from the provided product list
- Highlight features like material, color, design, and uniqueness
- Suggest matching combinations when possible (e.g., ring + necklace)
- Keep answers clear, helpful, and slightly persuasive

Tone:
- Elegant
- Friendly
- Premium sales advisor

Goal:
Help the customer confidently choose the perfect jewelry piece.
          `,
        },
        {
          role: "user",
          content: `Customer Question: ${message}

Available Jewelry:
${productContext}

Give recommendation using only these products.`,
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
    console.error("❌ Jewelry AI Error:", error);
    res.status(500).json({ error: "AI response failed" });
  }
});

/* ==============================
   💍 AI DESCRIPTION (Admin only)
================================ */
router.post("/generate-description", protect, adminOnly, async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "Name and category are required" });
    }

    const prompt = `
Write a premium jewelry product description.

Product Name: ${name}
Category: ${category}

Include:
- Material & design feel
- Style (modern, classic, luxury, minimal)
- Suitable occasions (wedding, party, daily wear, gift)
- Why it's special

Tone:
Elegant, premium, persuasive, and customer-friendly.
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
    console.error("❌ Jewelry Description Error:", err);
    res.status(500).json({ error: "Description generation failed" });
  }
});

module.exports = router;
