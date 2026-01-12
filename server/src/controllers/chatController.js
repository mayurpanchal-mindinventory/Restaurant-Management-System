const { createOrGetConversion } = require("../services/chatService");
const { sendResponse, STATUS } = require("../utils/constants");

exports.createOrGetConversion = async (req, res) => {
    try {
        const userId = req.user.id;
        const ownerId = req.body.id;

        const result = await createOrGetConversion(userId, ownerId);

        sendResponse(res, STATUS.OK, "FOUND CONVERSION", result)
    } catch (error) {
        console.error("Error in chat controller:", error);
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error
        );

    }

}