require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
const goodDeedsRoutes = require('./routes/goodDeeds');
const deedRoutes = require("./routes/deeds");
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    "https://dogood-pink.vercel.app"
    credentials: true
}));
app.use("/api/deeds", deedRoutes);
// Routes
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));
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
app.use('/api/good-deeds', goodDeedsRoutes);
app.use("/api/users", publicUserRoutes);
const path = require("path");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");

require("./services/googleStrategy");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"],
    },
});

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// API routes
app.use("/api/donations", require("./routes/donations"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/volunteering", require("./routes/volunteering"));
app.use("/api/verification", require("./routes/verification"));
app.use("/api/support", require("./routes/support"));
app.use("/api/gamification", require("./routes/gamification"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/report", require("./routes/report"));
app.use("/api/grants", require("./routes/grants"));
app.use("/api/map", require("./routes/map"));
app.use("/api/chat", require("./routes/chat"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
module.exports = app;

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
