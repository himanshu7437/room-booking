import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,          // ← added (prevents duplicate with different case)
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,             // ← optional but good practice
    },
    role: {
      type: String,
      enum: ["admin"],          // ← restrict to one value (future-proof if you add more roles)
      default: "admin",
    },
    // Optional: lastLogin, resetToken, etc. can be added later
  },
  { timestamps: true }
);

// Optional: index on email for faster lookup (already unique so not critical)
adminSchema.index({ email: 1 });

export default mongoose.model("Admin", adminSchema);