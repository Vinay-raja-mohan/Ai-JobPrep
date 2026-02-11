
import mongoose from "mongoose";

const LearningContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user has unique content per topic
LearningContentSchema.index({ userId: 1, topic: 1 }, { unique: true });

export const LearningContent = mongoose.models.LearningContent || mongoose.model("LearningContent", LearningContentSchema);
