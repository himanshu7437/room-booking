import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    room: {                           
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,                    
    },
    customer: {                       
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
      guests: {                       
        type: Number,
        required: true,
        min: 1,
      },
    },
    checkIn: {                        
      type: Date,
      required: true,
      index: true,                    
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
    notes: {                          
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index for fast availability checks (very important!)
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model("Booking", bookingSchema);