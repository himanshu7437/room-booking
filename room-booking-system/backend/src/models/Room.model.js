import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {                     
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {            
      type: Number,
      required: true,
      min: 0,
    },
    images: [{
      type: String,             
    }],
    capacity: {
      type: Number,
      required: true,           
      min: 1,
    },
    amenities: [{
      type: String,             
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);