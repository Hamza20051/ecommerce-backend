const express = require("express");
const groq = require("../config/groq"); // ✅ use config
const Product = require("../models/Product");
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Groq object keys:", Object.keys(groq));
  console.log("Groq chat:", groq.chat);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const products = await Product.find().limit(10);

    const productContext = products
      .map(
        (p) =>
          `Product: ${p.name}, Category: ${p.category}, Price: ${p.price}, Description: ${p.description}`
      )
      .join("\n");

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              ".Only recommend beauty You are a certified skincare and beauty advisor for an online cosmetics store.Rules:- Always ask about skin type if not provided (dry, oily, combination, sensitive).- Give step-by-step skincare guidance when relevant.- Recommend products ONLY from the provided product list.- If a product description is incorrect or unrelated, ignore it.- Be confident, friendly, and professional.- Keep responses clear and helpful (not apologetic).Tone:- Warm- Supportive- Expert skincare consultant` ",
          },
          {
            role: "user",
            content: `Customer Question: ${message}
            Available Products:\n${productContext}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      });
      
    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    res.status(500).json({ error: "AI response failed" });
  }
});
/* ==============================
   🤖 AI DESCRIPTION (Admin only)
================================ */
router.post('/generate-description', protect, adminOnly, async (req, res) => {
  try {
    const { name, category } = req.body;

    const prompt = `
Write a professional beauty product description.

Product name: ${name}
Category: ${category}

Include:
- Skin benefits
- Texture
- Who should use it
Tone: premium, friendly, marketing-ready.
`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    res.json({
      description: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error('AI Description Error:', err);
    res.status(500).json({ error: 'Description generation failed' });
  }
});

module.exports = router;
