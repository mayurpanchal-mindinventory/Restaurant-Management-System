const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");
const { MESSAGES, STATUS } = require("../utils/constants");
const socketService = require("./socketService");

const createMessages = async (chatId, senderId, text) => {
  try {
    if (!chatId || !senderId || !text) {
      const error = new Error("All fields are required");
      error.status = STATUS.BAD_REQUEST;
      error.message = MESSAGES.INVALID_REQUEST;
      throw error;
    }
    // console.log({ chatId, senderId, text });
    // check chat exists or not
    const chat = await Chat.findById(chatId);
    if (!chat) {
      const error = new Error("Chat not found");
      error.status = STATUS.NOT_FOUND;
      error.message = "Chat not found";
      throw error;
    }

    const sender = await User.findById(senderId);

    const saveMessage = await Message.create({ chatId, senderId, text });

    // Update chat's last msg
    await Chat.findByIdAndUpdate(chatId, { lastMessage: text });

    // Get  receiver
    const receiverId = chat.members.find(
      (member) => member.toString() !== senderId
    );

    // Emit real-time event to receiver
    if (receiverId) {
      const messageData = {
        _id: saveMessage._id,
        chatId,
        senderId: {
          _id: senderId,
          name: sender ? sender.name : "Unknown",
        },
        text,
        seen: false,
        createdAt: saveMessage.createdAt,
      };

      socketService.emitNewMessage(receiverId.toString(), messageData);
    }

    // Populate sender info for res
    await saveMessage.populate("senderId", "name email");

    return {
      success: true,
      message: "Message successfully sent",
      data: saveMessage,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

const getMessagesByChatId = async (chatId) => {
  try {
    // console.log(chatId);
    if (!chatId) {
      const error = new Error("Chat ID is required");
      error.status = STATUS.BAD_REQUEST;
      error.message = MESSAGES.INVALID_REQUEST;
      throw error;
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    return {
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
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
  createMessages,
  getMessagesByChatId,
};
