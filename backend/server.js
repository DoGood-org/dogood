
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");

const publicUserRoutes = require("./routes/publicUser");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const goodbotRoutes = require("./routes/goodbot");
const volunteeringRoutes = require("./routes/volunteering");
const walletRoutes = require("./routes/wallet");
const friendsRoutes = require("./routes/friends");
const notificationsRoutes = require("./routes/notifications");
const apiRoutes = require("./routes/api");
const blockchainRoutes = require("./routes/blockchain");
const chatRoutes = require("./routes/chat");
const gamificationRoutes = require("./routes/gamification");
const locationsRoutes = require("./routes/locations");
const paymentsRoutes = require("./routes/payments");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const verificationRoutes = require("./routes/verification");
const goodDeedsRoutes = require("./routes/goodDeeds");
const deedRoutes = require("./routes/deeds");

require("./services/googleStrategy");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://dogood-pink.vercel.app"
];

// ✅ CORS  Express
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());

// ✅ CORS  WebSocket
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/deeds", deedRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/goodbot", goodbotRoutes);
app.use("/api/volunteering", volunteeringRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api", apiRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/good-deeds", goodDeedsRoutes);
app.use("/api/users", publicUserRoutes);

// WebSocket handling
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!mongoUri) throw new Error("MongoDB connection string is missing.");

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    server.listen(PORT, () => {
      console.log(`Server running with WebSocket on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

startServer();
