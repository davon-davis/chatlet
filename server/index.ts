import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequestBody {
  messages: ChatCompletionMessageParam[];
}

app.post(
  "/api/chat",
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    try {
      const { messages } = req.body;
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });
      const botMessage = completion.choices[0].message;
      res.json({ message: botMessage });
    } catch (err) {
      console.error("OpenAI error:", err);
      res.status(500).json({ error: "OpenAI request failed" });
    }
  },
);

app.get("/", (_req, res) => {
  res.send("Chatlet server is running");
});

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../..", "dist");
  app.use(express.static(clientDist));

  app.get("/*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`✅ Chat proxy running at http://localhost:${PORT}`);
});
