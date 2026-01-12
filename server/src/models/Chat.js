const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Add indexes for better query performance
chatSchema.index({ members: 1 });
chatSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
