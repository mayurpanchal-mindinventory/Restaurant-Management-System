const Booking = require("../models/Booking");

const throwError = (msg, status = 400) => {
  const err = new Error(msg);
  err.status = status;
  throw err;
};

exports.BookRestaurant = async (req) => {
  try {
    const { userId, restaurantId, timeSlotId, date, numberOfGuests } = req.body;

    if (!userId || !restaurantId || !timeSlotId || !date || !numberOfGuests)
      throwError("All fields are required for booking");

    if (new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
      throwError("Booking date cannot be in the past");

    const result = await Booking.create({
      userId,
      restaurantId,
      timeSlotId,
      date,
      numberOfGuests,
    });

    return { message: "Restaurant booked successfully", data: result };
  } catch (error) {
    if (error.status) throw error;
    // if (error.code === 11000) throwError("This booking already exists", 409);
    if (error.name === "ValidationError")
      throwError("Invalid booking data", 400);

    console.error("Service Error:", error);
    throwError("Failed to create booking due to server error", 500);
  }
};

exports.getBookings = async (userId) => {
  try {
    if (!userId) throwError("User ID is required");

    const bookings = await Booking.find({ userId })
      .populate("restaurantId", "name description mainImage logoImage")
      .populate("timeSlotId", "timeSlot")
      .sort({ createdAt: -1 });

    return { message: "Bookings retrieved successfully", data: bookings };
  } catch (error) {
    if (error.status) throw error;
    throwError("Failed to retrieve bookings", 500);
  }
};
