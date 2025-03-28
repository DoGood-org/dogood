require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const goodbotRoutes = require("./routes/goodbot");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/goodbot", goodbotRoutes);

// 📌 Подключаем маршруты
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`)))
    .catch((error) => console.error("❌ MongoDB connection error:", error));
