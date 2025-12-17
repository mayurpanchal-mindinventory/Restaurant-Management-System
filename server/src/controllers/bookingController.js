const { STATUS, MESSAGES, sendResponse } = require("../utils/constants.js");
const { BookRestaurant, getBookings } = require("../services/userService.js");

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
