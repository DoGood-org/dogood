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
app.use(cors());
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

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`)))
    .catch((error) => console.error("❌ MongoDB connection error:", error));
