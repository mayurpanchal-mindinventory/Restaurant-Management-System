const { getAllCategories, createMenu, getAllMenusByRestaurant, deleteMenuById } = require("../services/menuService.js");
const { STATUS, MESSAGES, sendResponse } = require("../utils/constants.js");

exports.getAllMenuCategories = async (req, res) => {
    try {
        const result = await getAllCategories();
        return sendResponse(res, STATUS.CREATED, result.message, result.data);
    } catch (error) {
        console.error("Error in getAllMenuCategories controller:", error);
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error.details
        );
    }
};
exports.createMenuItem = async (req, res) => {
    try {
        const result = await createMenu(req);
        return sendResponse(res, STATUS.CREATED, result.message, result.data);
    } catch (error) {
        console.error("Error in getAllMenuCategories controller:", error);
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error.details
        );
    }
};

exports.getAllMenusByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getAllMenusByRestaurant(id);
        return sendResponse(res, STATUS.OK, result.message, result.data);
    } catch (error) {
        console.error("Error in getAllRestaurantsWithOwners controller:", error);
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR
        );
    }
};

exports.deleteMenuById = async (req, res) => {
    try {
        const result = await deleteMenuById(req);
        return sendResponse(res, STATUS.OK, result.message, result.data);
    } catch (error) {
        console.error("Error in deleteMenucontroller:", error);
        return sendResponse(
            res,
            error.status || STATUS.INTERNAL_SERVER_ERROR,
            error.message || MESSAGES.SERVER_ERROR,
            error.details
        );
    }
};