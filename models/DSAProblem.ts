
import mongoose from "mongoose";

const DSAProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  problem: {
    type: Object, // Stores the JSON problem structure
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user has one active problem per topic (we upsert this)
DSAProblemSchema.index({ userId: 1, topic: 1 }, { unique: true });

export const DSAProblem = mongoose.models.DSAProblem || mongoose.model("DSAProblem", DSAProblemSchema);
