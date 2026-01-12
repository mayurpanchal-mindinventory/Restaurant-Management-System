const {
  createMessages,
  getMessagesByChatId,
} = require("../services/messageService");
const { sendResponse, STATUS, MESSAGES } = require("../utils/constants");

exports.createMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req?.user?.user?._id;

    if (!chatId || !text) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST,
        null
      );
    }

    const result = await createMessages(chatId, senderId, text);

    sendResponse(res, STATUS.CREATED, result.message, result.data);
  } catch (error) {
    console.error("Error in message controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      null
    );
  }
};

exports.getMessages = async (req, res) => {
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

    const result = await getMessagesByChatId(chatId);

    sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in message controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      null
    );
  }
};
