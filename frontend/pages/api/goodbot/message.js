
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { message, history } = req.body;

    if (!message || !Array.isArray(history)) {
      return res.status(400).json({ error: "Missing message or invalid history" });
    }

    const messages = [
      ...history,
      { role: "user", content: message }
    ];

    console.log("GoodBot request:", JSON.stringify(messages, null, 2));

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
    });

    const reply = completion.data.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("GOODBOT ERROR:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to get response from GoodBot" });
  }
}
