const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
        ],
        lastMessage: { type: String, required: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Chat", chatSchema);
