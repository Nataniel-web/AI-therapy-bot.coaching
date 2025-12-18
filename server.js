import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 SYSTEM PROMPT (AQUI 👇)
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

Modes:
1. Calm Therapy Mode
2. Coaching Mode
3. Productivity Mode
`;

// 🔹 ROTA PRINCIPAL DO CHAT
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT }, // 👈 USADO AQUI
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

app.listen(3000, () => {
  console.log("MindBalance AI backend running on port 3000");
});
