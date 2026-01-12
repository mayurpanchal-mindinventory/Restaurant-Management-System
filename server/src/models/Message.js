const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add indexes for better query performance
messageSchema.index({ chatId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ seen: 1 });

module.exports = mongoose.model("Message", messageSchema);
