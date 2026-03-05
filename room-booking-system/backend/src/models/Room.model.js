import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {                     // ← changed from "title" → more natural for rooms
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {            // ← renamed for clarity (price → pricePerNight)
      type: Number,
      required: true,
      min: 0,
    },
    images: [{
      type: String,             // file path or cloud URL (e.g. "/uploads/xxx.jpg" or "https://...")
    }],
    capacity: {
      type: Number,
      required: true,           // ← made required (default is ok but better explicit)
      min: 1,
    },
    amenities: [{
      type: String,             // e.g. ["WiFi", "AC", "TV", "Breakfast"]
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);