const { default: mongoose } = require("mongoose");
const Chat = require("../models/Chat");
const chat = require("../models/Chat");
const { MESSAGES, STATUS } = require("../utils/constants");
const createOrGetConversion = async (userId, ownerId) => {
  try {
    if (!userId || !ownerId) {
      const error = new Error("User ID and Owner ID are required");
      error.status = STATUS.BAD_REQUEST;
      error.message = MESSAGES.INVALID_REQUEST;
      throw error;
    }

    const chatData = await chat.findOne({
      members: { $all: [userId, ownerId] },
    });

    if (!chatData) {
      const newChat = await chat.create({ members: [userId, ownerId] });

      return {
        success: true,
        message: "Chat Created",
        data: newChat,
      };
    }

    return {
      success: true,
      message: "Chat Found",
      data: chatData,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

const getUserChats = async (userId) => {
  try {
    if (!userId) {
      const error = new Error("User ID is required");
      error.status = STATUS.BAD_REQUEST;
      error.message = MESSAGES.INVALID_REQUEST;
      throw error;
    }
    const chats = await Chat.find({ members: userId })
      .populate({
        path: "members",
        match: { _id: { $ne: userId } }, // This makes "you" null in the array
        select: "name email",
      })
      .sort({ updatedAt: -1 });

    // Transform array of chats into objects with an 'otherUser' field
    const formattedChats = chats.map((chat) => {
      const chatObj = chat.toObject();

      // Find the member that isn't null (the other user)
      const otherUser = chatObj.members.find((m) => m !== null);

      return {
        ...chatObj,
        otherUser: otherUser || null, // Your new object field
        members: undefined, // Remove the old array field
      };
    });
    return {
      success: true,
      message: "Chats retrieved successfully",
      data: formattedChats,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message;
    }
    throw error;
  }
};

const getChatById = async (chatId) => {
  try {
    if (!chatId) {
      const error = new Error("Chat ID is required");
      error.status = STATUS.BAD_REQUEST;
      error.message = MESSAGES.INVALID_REQUEST;
      throw error;
    }
    const chatData = await chat.findById(chatId);

    if (!chatData) {
      const error = new Error("Chat not found");
      error.status = STATUS.NOT_FOUND;
      error.message = "Chat not found";
      throw error;
    }

    return {
      success: true,
      message: "Chat retrieved successfully",
      data: chatData,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

module.exports = {
  createOrGetConversion,
  getUserChats,
  getChatById,
};
