const express = require("express");
const {
  createOrGetConversion,
  getUserChats,
  getChat,
} = require("../controllers/chatController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createOrGetConversion);

// Get all chats for current user
router.get("/", getUserChats);

// Get specific chat by ID
router.get("/:chatId", getChat);

module.exports = router;
