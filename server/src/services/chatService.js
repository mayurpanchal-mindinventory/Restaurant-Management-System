const chat = require("../models/Chat");

const createOrGetConversion = async (userId, OwnerId) => {
    try {
        const chatData = await chat.findOne({ members: { $all: [userId, OwnerId] } });

        if (!chatData) {
            chatData = chat.create({ members: [userId, OwnerId] });
        }

        return {
            success: true,
            message: "Chat Created or Found",
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

};
