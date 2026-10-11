
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BABU AI Backend is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        reply: "Babu: Apna message likho."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        reply: "Babu ka AI abhi configure nahi hua hai."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions:
            "Tum BABU AI ho. Hindi ya Hinglish mein friendly, helpful aur short jawab do.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI API error:", response.status);
      return res.status(502).json({
        reply: "Babu abhi jawab nahi de pa rahi. Thodi der baad try karo."
      });
    }

    const reply =
      data.output
        ?.flatMap(item => item.content || [])
        .find(item => item.type === "output_text")
        ?.text || "Babu ko jawab nahi mila.";

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({
      reply: "Connection mein problem hai. Dobara try karo."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`BABU AI running on port ${PORT}`);
});
