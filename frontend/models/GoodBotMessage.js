import mongoose from "mongoose";

const GoodBotMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.GoodBotMessage || mongoose.model("GoodBotMessage", GoodBotMessageSchema);
