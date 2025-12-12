const { STATUS, MESSAGES, sendResponse } = require("../utils/constants.js");
const {
  createRestaurantAccount,
  getAllRestaurantsWithOwners,
  updateRestaurant,
  deleteRestaurant,
} = require("../services/adminService.js");

exports.createRestaurantAccount = async (req, res) => {
  try {
    const result = await createRestaurantAccount(req);
    return sendResponse(res, STATUS.CREATED, result.message, result.data);
  } catch (error) {
    console.error("Error in createRestaurantAccount controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};

exports.getAllRestaurantsWithOwners = async (req, res) => {
  try {
    const result = await getAllRestaurantsWithOwners();
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

exports.updateRestaurant = async (req, res) => {
  try {
    const result = await updateRestaurant(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in updateRestaurant controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const result = await deleteRestaurant(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in deleteRestaurant controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};
