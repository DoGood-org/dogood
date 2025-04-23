const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      type: { type: String, required: true }, // e.g. "message", "post", "system"
      message: { type: String, required: true },
      link: { type: String },
      read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
