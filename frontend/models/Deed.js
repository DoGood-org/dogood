import mongoose from "mongoose";

const DeedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  type: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Deed || mongoose.model("Deed", DeedSchema);
