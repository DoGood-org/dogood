let io;

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const initIO = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://dogood-pink.vercel.app"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 GoodBot WebSocket connected:", socket.id);

    socket.on("typing", () => {
      socket.broadcast.emit("botTyping", true);
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("botTyping", false);
    });

    socket.on("message", async ({ prompt, lang }) => {
      const { Configuration, OpenAIApi } = require("openai");
      const openai = new OpenAIApi(
        new Configuration({ apiKey: process.env.OPENAI_API_KEY })
      );

      try {
        const systemPrompt =
          lang === "ua"
            ? "Ти — доброзичливий помічник платформи добрих справ DoGood."
            : "You are a helpful assistant of the DoGood platform.";

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ]
        });

        const reply = completion.data.choices[0].message.content;

        socket.emit("botMessage", reply);
        socket.broadcast.emit("newBotMessage", reply);
      } catch (err) {
        socket.emit("botMessage", "⚠️ Error from AI: " + err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 GoodBot WebSocket disconnected:", socket.id);
    });
  });

  return io;
};
