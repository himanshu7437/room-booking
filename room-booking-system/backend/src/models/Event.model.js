import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    videoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);