import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
      index: true,              // ← useful for sorting upcoming events
    },
    images: [{
      type: String,             // paths or URLs
    }],
    vlog: {                     // ← new structured field instead of just videoUrl
      type: {
        type: String,
        enum: ["upload", "youtube", "none"],
        default: "none",
      },
      url: {
        type: String,
        trim: true,
      },
    },
    isPublished: {              // ← added (client wants publish button)
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);