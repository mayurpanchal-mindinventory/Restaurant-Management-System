const { STATUS, MESSAGES, sendResponse } = require("../utils/constants.js");
const {
  createRestaurantAccount,
  getAllRestaurantsWithOwners,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantWithOwnerById,
  allBooking,
  changeRestaurantStatusById,
} = require("../services/adminService.js");
const { getRestaurantMenu } = require("../services/RestaurantPanelService.js");

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
    const result = await getAllRestaurantsWithOwners(req);
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
exports.getRestaurantsWithOwnerById = async (req, res) => {
  try {
    const Id = req.params.Id;
    //console.log(Id);
    const result = await getRestaurantWithOwnerById(Id);

    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in getRestaurantsWithOwnerById controller:", error);
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


exports.restaurantStatusChange = async (req, res) => {
  try {
    const result = await changeRestaurantStatusById(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in changeStatus controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};
exports.getAllBookingswithDetails = async (req, res) => {
  try {
    const result = await allBooking(req);

    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in getRestaurantsWithOwnerById controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.getAllMenu = async (req, res) => {
  try {
    const result = await getRestaurantMenu(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in getAllMenu controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};
