const TimeSlot = require("../models/TimeSlot");
const { createSlot, slotList, deleteSlot, updateSlot, getSlotDetails } = require("../services/slotService");
const { STATUS, sendResponse } = require("../utils/constants");

exports.createSlot = async (req, res) => {
    try {
        const slot = await createSlot(req.body);
        console.log(slot);

        return sendResponse(res, STATUS.OK, "Slot Created", slot);

    } catch (err) {
        res.status(STATUS.BAD_REQUEST).json({ error: err.message });
    }
};
exports.getSlotList = async (req, res) => {
    try {
        const slot = await slotList(req);
        return sendResponse(res, STATUS.OK, slot.message, slot);

    } catch (error) {
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error.details
        );
    }
};


exports.deleteSlotById = async (req, res) => {
    try {
        const result = await deleteSlot(req);
        return sendResponse(res, STATUS.OK, "Slot Deleted", result);
    } catch (error) {
        console.error("Error in deleteSlotcontroller:", error);
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error.details
        );
    }
};

exports.updateSlotById = async (req, res) => {
    try {
        const slot = await updateSlot(req);
        return sendResponse(res, STATUS.OK, "Slot Updated", slot);

    } catch (err) {
        res.status(STATUS.BAD_REQUEST).json({ error: err.message });
    }
};

exports.getSlotById = async (req, res) => {
    try {
        const slot = await getSlotDetails(req);
        return sendResponse(res, STATUS.OK, "", slot);

    } catch (error) {
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error.details
        );
    }
};
