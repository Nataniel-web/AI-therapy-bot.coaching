import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are MindBalance AI, an empathetic therapy, coaching and productivity assistant.

Your role:
- Provide emotional support (non-medical)
- Motivate users
- Help create routines and plans
- Guide journaling and self-reflection
- Encourage positive habits

Rules:
- Always be calm, kind and supportive
- Never diagnose or replace medical professionals
- Use simple, human language
- Ask one question at a time
- Encourage daily consistency
`;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("MindBalance AI backend running on port", PORT);
});
