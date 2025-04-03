const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://username:password@cluster.mongodb.net/dogood")
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch(err => console.error("❌ Connection error:", err));
