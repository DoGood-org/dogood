import mongoose from "mongoose";

const HelpHourSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hours: Number,
  note: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.HelpHour || mongoose.model("HelpHour", HelpHourSchema);
