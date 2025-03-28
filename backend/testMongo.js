const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://username:password@cluster.mongodb.net/dogood")
  .then(() => console.log("✅ Подключение к MongoDB успешно!"))
  .catch(err => console.error("❌ Ошибка подключения:", err));
