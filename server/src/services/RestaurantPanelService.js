const Booking = require("../models/Booking.js");
const Restaurant = require("../models/Restaurant.js");
const { STATUS } = require("../utils/constants.js");
const MenuItem = require("../models/MenuItem.js");
exports.getBookingByRestaurent = async (req) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const restaurant = await Restaurant.findOne({ userId });

    if (!restaurant) {
      throw new Error("Restaurant not found for this user");
    }

    const restaurantId = restaurant._id;

    // const { page } = req.query;
    const page = 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const booking = await Booking.find({ restaurantId })
      .populate("userId", "name email -_id")
      .populate("restaurantId", "name logoImage -_id")
      .populate("timeSlotId", "timeSlot -_id")
      .select("numberOfGuests date status createdAt _id")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Booking.countDocuments({ restaurantId });

    return {
      success: true,
      message: "Bookings retrieved successfully",
      data: {
        booking,
        totalPages: Math.ceil(count / limit),
        currentPage: page * 1,
        totalDocs: count,
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

exports.updateStatusById = async (req) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    // console.log(status);
    const updateStatus = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return {
      success: true,
      data: {
        updateStatus,
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

exports.createBill = async (req) => {
  try {
    const { bookingId, restaurantId, userId, items, paymentStatus } = req.body;

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((item) => item.itemId) },
    });
  } catch (error) {}
};
