const express = require("express");
const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Create new msg
router.post("/", verifyToken, createMessage);

// Get all msg for a chat
router.get("/:chatId", getMessages);

module.exports = router;
