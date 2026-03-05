import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    room: {                           // ← renamed from roomId → conventional mongoose ref name
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,                    // ← speeds up availability queries
    },
    customer: {                       // ← group fields under customer object (cleaner)
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      guests: {                       // ← added (client said "Number of Guests")
        type: Number,
        required: true,
        min: 1,
      },
    },
    checkIn: {                        // ← renamed checkInDate → checkIn (shorter, standard)
      type: Date,
      required: true,
      index: true,                    // ← very important for range queries
    },
    checkOut: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {                          // ← optional field — useful for special requests
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index for fast availability checks (very important!)
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model("Booking", bookingSchema);