import mongoose from 'mongoose';

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
      index: true,
    },
    images: [{
      type: String,           // paths: "/uploads/events/images/xxx.jpg" or cloud URLs
    }],
    vlog: {
      type: {
        type: String,
        enum: ['none', 'youtube', 'upload'],
        default: 'none',
      },
      url: {
        type: String,
        trim: true,
        // e.g. "https://youtu.be/abc123" or "/uploads/events/videos/xyz.mp4"
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Virtual for "upcoming" helper (optional)
eventSchema.virtual('isUpcoming').get(function () {
  return this.eventDate > new Date();
});

export default mongoose.model('Event', eventSchema);