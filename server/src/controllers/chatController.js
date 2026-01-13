const {
  createOrGetConversion,
  getUserChats,
  getChatById,
} = require("../services/chatService");
const { sendResponse, STATUS, MESSAGES } = require("../utils/constants");

exports.createOrGetConversion = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const ownerId = req.body.id;

    if (!ownerId) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST,
        null
      );
    }

    const result = await createOrGetConversion(userId, ownerId);

    sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in chat controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      null
    );
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userId = req?.user?.user?._id;
    const result = await getUserChats(userId);

    sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in chat controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      null
    );
  }
};

exports.getChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST,
        null
      );
    }

    const result = await getChatById(chatId);
    sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in chat controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      null
    );
  }
};
