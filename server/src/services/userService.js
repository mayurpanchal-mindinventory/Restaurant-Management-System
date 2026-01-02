const { default: mongoose } = require("mongoose");
const Booking = require("../models/Booking");
const TimeSlot = require("../models/TimeSlot");
const Bill = require("../models/Bill");
const Restaurant = require("../models/Restaurant");
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

    const olddata = { userId, restaurantId, date, timeSlotId };
    const update = { $inc: { numberOfGuests: numberOfGuests } };
    const options = {
      upsert: true,
      new: true,
      session,
      runValidators: true
    };

    const booking = await Booking.findOneAndUpdate(olddata, update, options);

    await TimeSlot.findByIdAndUpdate(timeSlotId, {
      $inc: { maxBookings: -numberOfGuests },
    }).session(session);
    await session.commitTransaction();
    session.endSession();

    return { message: "Restaurant booked successfully", data: booking };
  } catch (error) {
    if (error.status) throw error;
    // if (error.code === 11000) throwError("This booking already exists", 409);
    if (error.name === "ValidationError")
      throwError("Invalid booking data", 400);

    console.error("Service Error:", error);
    throwError("Failed to create booking due to server error", 500);
  }
};

exports.getBookings = async (userId, options = {}) => {
  try {
    if (!userId) throwError("User ID is required");

    const {
      page = 1,
      limit = 10,
      searchDate,
      searchRestaurant,
      sortBy = "date",
      sortOrder = "desc",
      status, // for current/past filtering
    } = options;

    const query = { userId };
    // first here searchRestaurant work first restaurants matching the name and then pass their IDs into your query object.

    if (searchRestaurant) {
      const matchingRestaurants = await Restaurant.find({
        name: { $regex: searchRestaurant, $options: "i" },
      }).select("_id");
      const restaurantIds = matchingRestaurants.map((res) => res._id);
      query.restaurantId = { $in: restaurantIds };
    }

    // Search by date (exact match)
    if (searchDate) {
      const searchDateObj = new Date(searchDate);
      const nextDay = new Date(searchDateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = {
        $gte: new Date(searchDateObj.toISOString().split("T")[0]),
        $lt: new Date(nextDay.toISOString().split("T")[0]),
      };
    }

    // Filter by status (for current/past)
    if (status) {
      if (status === "current") {
        query.status = { $ne: "Completed" };
      } else if (status === "past") {
        query.status = "Completed";
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("restaurantId", "name description mainImage logoImage")
        .populate("timeSlotId", "timeSlot")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return {
      message: "Bookings retrieved successfully",
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    if (error.status) throw error;
    throwError("Failed to retrieve bookings", 500);
  }
};

exports.getBillByuserId = async (req) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      searchDate,
      searchRestaurant,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { userId, isSharedWithUser: true };

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [bills, totalDocs] = await Promise.all([
      Bill.find(query)
        .populate({
          path: "bookingId",
          populate: { path: "timeSlotId", model: "TimeSlot" },
        })
        .populate("restaurantId userId")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Bill.countDocuments(query),
    ]);

    // Client-side date filtering if searchDate is provided
    let filteredBills = bills;
    let filteredTotal = totalDocs;

    if (searchDate) {
      filteredBills = bills.filter((bill) => {
        if (!bill.bookingId?.date) return false;
        const billDate = new Date(bill.bookingId.date)
          .toISOString()
          .split("T")[0];
        return billDate === searchDate;
      });
      filteredTotal = filteredBills.length;
    }

    return {
      success: true,
      message: "Bill retrive Successfully",
      data: filteredBills,
      pagination: {
        total: filteredTotal,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredTotal / limit),
      },
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
