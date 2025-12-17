export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  RESTAURANT_FOUND: "Restaurant found succesfully",
  RESTAURANT_CREATED: "Restaurant created successfully.",
  RESTAURANT_UPDATED: "Restaurant updated successfully.",
  RESTAURANT_DELETED: "Restaurant deleted successfully.",
  RESTAURANT_NOT_FOUND: "Restaurant not found.",
  RESTAURANT_EXIST: "Restaurant already exists",
  INVALID_REQUEST: "Invalid request data.",
  SERVER_ERROR: "Something went wrong on the server.",
  RESTAURANT_NOTADD: "Something went wrong Restaurant adding failed",
  RESTAURANT_NOTUPDATE: "Something went wrong Restaurant update failed",
  RESTAURANT_NOTDELETE: "Something went wrong Restaurant delete failed",
  MENU_DELETED: "Menu deleted successfully.",
  MENU_NOTDELETE: "Something went wrong Menu delete failed",
  BOOKING_CREATED: "Restaurant booked successfully!",
  BOOKING_RETRIEVED: "Bookings retrieved successfully.",
  BOOKING_FAILED: "Failed to create booking.",
  BOOKING_NOT_FOUND: "Booking not found.",
  BOOKING_INVALID_DATA: "Invalid booking data provided.",
  BOOKING_DATE_INVALID: "Booking date cannot be in the past.",
  BOOKING_GUESTS_INVALID: "Number of guests must be between 1 and 20.",
  BOOKING_ALREADY_EXISTS: "This booking already exists.",
  BOOKING_USER_REQUIRED: "User ID is required.",
};

export const sendResponse = (res, status, msg, data) => {
  return res.status(status).json({ message: msg, data });
};
