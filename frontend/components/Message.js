import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
