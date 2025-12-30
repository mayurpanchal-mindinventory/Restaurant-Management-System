const { default: mongoose } = require("mongoose");
const Booking = require("../models/Booking");
const TimeSlot = require("../models/TimeSlot");
const Bill = require("../models/Bill");
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
    const numberOfSlotRemaining = await TimeSlot.findById(timeSlotId).select(
      "maxBookings -_id"
    );
    const availableSlots = numberOfSlotRemaining?.maxBookings;

    if (Number(availableSlots) < numberOfGuests)
      throwError(`only ${availableSlots} are left`);

    if (new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
      throwError("Booking date cannot be in the past");
    const session = await mongoose.startSession();
    session.startTransaction();

    const newBooking = new Booking({
      userId,
      restaurantId,
      timeSlotId,
      date,
      numberOfGuests,
    });
    await newBooking.save({ session });

    await TimeSlot.findByIdAndUpdate(timeSlotId, {
      $inc: { maxBookings: -numberOfGuests },
    }).session(session);
    await session.commitTransaction();
    session.endSession();

    return { message: "Restaurant booked successfully", data: newBooking };
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

exports.getBillByuserId = async (req) => {
  try {
    const { userId } = req.params;
    const result = await Bill.find({
      userId: userId,
      isSharedWithUser: true,
    })
      .populate({
        path: "bookingId",
        populate: {
          path: "timeSlotId",
          model: "TimeSlot"
        },
      })
      .populate("restaurantId userId");
    console.log(result);
    return {
      success: true,
      message: "Bill retrive Successfully",
      data: result,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message;
    }
    throw error;
  }
};

exports.UpdateSharedWithUser = async (req) => {
  try {
    const { bookingid } = req.params;
    const { isSharedWithUser } = req.body;

    const result = await Bill.findByIdAndUpdate(bookingid, {
      isSharedWithUser,
    });
    return {
      success: true,
      message: "Update shared with user in Bill sucessfully",
      data: result,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message;
    }
    throw error;
  }
};
