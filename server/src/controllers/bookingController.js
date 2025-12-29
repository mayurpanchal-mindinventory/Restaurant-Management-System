const { STATUS, MESSAGES, sendResponse } = require("../utils/constants.js");
const {
  BookRestaurant,
  getBookings,
  getBillByuserId,
  UpdateSharedWithUser,
} = require("../services/userService.js");
const {
  getBookingByRestaurent,
  updateStatusById,
  createBill,
  getBillsByRestaurant,
  getBillById,
  updateBillPaymentStatus,
} = require("../services/RestaurantPanelService.js");
exports.createBooking = async (req, res) => {
  try {
    const { message, data } = await BookRestaurant(req);
    return sendResponse(res, STATUS.CREATED, message, data);
  } catch (error) {
    console.error("Booking Error:", error.message);
    return sendResponse(
      res,
      error.status || 500,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId)
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        MESSAGES.BOOKING_USER_REQUIRED
      );

    const { message, data } = await getBookings(userId);
    return sendResponse(res, STATUS.OK, message, data);
  } catch (error) {
    console.error("Retrieval Error:", error.message);
    return sendResponse(
      res,
      error.status || 500,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.getAllbookingByRestaurant = async (req, res) => {
  try {
    const result = await getBookingByRestaurent(req);
    // console.log(result);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error(
      "Error in getError in getAlllbookingByRestaurant controller:",
      error
    );
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const result = await updateStatusById(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error(
      "Error in getError in updateBookingStatus controller:",
      error
    );
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.createBillForBooking = async (req, res) => {
  try {
    const result = await createBill(req);
    return sendResponse(res, STATUS.CREATED, result.message, result.data);
  } catch (error) {
    console.error("Error creating bill:", error.message);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.getBillsForRestaurant = async (req, res) => {
  try {
    const result = await getBillsByRestaurant(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error getting bills:", error.message);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.getBillByIdController = async (req, res) => {
  try {
    const result = await getBillById(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error getting bill by ID:", error.message);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.updateBillPaymentStatusController = async (req, res) => {
  try {
    const result = await updateBillPaymentStatus(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error updating bill payment status:", error.message);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};

exports.desiplayBillByUserid = async (req, res) => {
  try {
    const result = await getBillByuserId(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in desiplayBillByUserid controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};
exports.updateSharedWithUserByBookingid = async (req, res) => {
  try {
    const result = await UpdateSharedWithUser(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error(
      "Error in updateSharedWithUserByBookingid controller:",
      error
    );

    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};
