require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
dotenv.config();
const publicUserRoutes = require("./routes/publicUser");
const profileRoutes = require("./routes/profile");
const walletRoutes = require("./routes/wallet");
const friendsRoutes = require("./routes/friends");
const apiRoutes = require("./routes/api");
const blockchainRoutes = require("./routes/blockchain");
const volunteeringRoutes = require("./routes/volunteering");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const notificationRoutes = require("./routes/notifications");
const meRoutes = require("./routes/me");
const authMiddleware = require("./middleware/authMiddleware");
const settingsRoutes = require("./routes/settings");
const goodbotRoutes = require("./routes/goodbot");
const messageRoutes = require("./routes/messages");
const statsRoutes = require("./routes/stats");
const uploadRoutes = require("./routes/upload");
const chatRoutes = require("./routes/chat");
const gamificationRoutes = require("./routes/gamification");
const locationsRoutes = require("./routes/locations");
const paymentsRoutes = require("./routes/payments");
const app = express();
const server = http.createServer(app);
const verificationRoutes = require("./routes/verification");
const goodDeedsRoutes = require("./routes/goodDeeds");
const deedRoutes = require("./routes/deeds");

require("./services/googleStrategy");

// Allowed frontend domains
const cors = require('cors');

const allowedOrigins = [
    'http://localhost:3000',
    'https://dogood-pink.vercel.app',
    'https://dogood.vercel.app',
    'https://dogood.onrender.com'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true
    }
}));
app.use(passport.initialize());
require("./config/passport")(passport);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/deeds", deedRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api", apiRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/me", meRoutes); // public
app.use("/api/me", authMiddleware, meRoutes); // protected
app.use("/api/settings", settingsRoutes);
app.use("/api/goodbot", goodbotRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);
app.use("/upload", uploadRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/map', require('./routes/map'));
app.use("/api/volunteering", volunteeringRoutes);
// WebSocket server
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://dogood-pink.vercel.app",
            "https://dogood.vercel.app"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Online users map
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("online", (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        }
    });

    socket.on("typing", ({ sender, room }) => {
        socket.to(room).emit("typing", { sender });
    });

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });

    socket.on("sendMessage", ({ roomId, message }) => {
        io.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
            }
        }
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
});

// MongoDB connection + start
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected");

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
};

startServer();
