import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  bio: String,
  theme: String,
  isEmailVerified: { type: Boolean, default: false },
  publicSlug: String,
  isPublicProfile: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
