const Booking = require("../models/Booking.js");
const User = require("../models/User.js");

const Restaurant = require("../models/Restaurant.js");
const { STATUS, MESSAGES } = require("../utils/constants.js");
const MenuItem = require("../models/MenuItem.js");
const TimeSlot = require("../models/TimeSlot.js");
exports.getBookingByRestaurent = async (req) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      throw error;
    }

    const restaurant = await Restaurant.findOne({ userId });

    if (!restaurant) {
      const error = new Error("Restaurant not found for this user");
      error.status = 404;
      throw error;
    }

    const restaurantId = restaurant._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Build the dynamic filter for the main list
    const mainQuery = { restaurantId };

    if (req.query.status) {
      mainQuery.status = req.query.status;
    }

    if (req.query.date) {
      mainQuery.date = req.query.date;
    }

    if (req.query.search) {
      const users = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }).select("_id");
      const userIds = users.map((u) => u._id);
      mainQuery.userId = { $in: userIds };
    }

    const results = await Booking.aggregate([
      {
        $facet: {
          // Branch 1: Paginated & Filtered Data
          bookings: [
            { $match: mainQuery },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $lookup: {
                from: "timeslots",
                localField: "timeSlotId",
                foreignField: "_id",
                as: "timeSlotDetails",
              },
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$timeSlotDetails", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                numberOfGuests: 1,
                date: 1,
                status: 1,
                createdAt: 1,
                hasGeneratedBill: 1,
                billId: 1,
                restaurantId: 1,
                "timeSlotId": "$timeSlotDetails", // Mapping back to your preferred name
                "userId": {
                  _id: "$userDetails._id",
                  name: "$userDetails.name",
                  email: "$userDetails.email"
                }
              },
            },
          ],
          // Branch 2: Total count for current filters (for pagination)
          totalFilteredCount: [
            { $match: mainQuery },
            { $count: "count" }
          ],
          // Branch 3: Stats (Total Pending for this restaurant regardless of filter)
          pendingCount: [
            { $match: { restaurantId, status: "Pending" } },
            { $count: "count" },
          ],
          // Branch 4: Stats (Total Completed for this restaurant regardless of filter)
          completedCount: [
            { $match: { restaurantId, status: "Completed" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const bookings = results[0].bookings;
    const totalDocs = results[0].totalFilteredCount[0]?.count || 0;
    const totalPending = results[0].pendingCount[0]?.count || 0;
    const totalCompleted = results[0].completedCount[0]?.count || 0;

    return {
      success: true,
      message: "Bookings retrieved successfully",
      data: {
        bookings,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        totalDocs,
        totalPending,
        totalCompleted,
      },
    };
  } catch (error) {
    // Ensure we send back a status and message
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";

    // In a real app, you might want to log the error here
    throw { status: statusCode, message: message };
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
    const {
      bookingId,
      restaurantId,
      userId,
      items,
      discountPercent = 0,
      isSharedWithUser = false,
      paymentStatus = "Unpaid",
    } = req.body;

    if (
      !bookingId ||
      !restaurantId ||
      !userId ||
      !items ||
      items.length === 0
    ) {
      throw new Error("Missing required fields for bill creation");
    }

    // Check if bill already exists for this booking
    const existingBooking = await Booking.findById(bookingId);
    if (existingBooking.hasGeneratedBill) {
      throw new Error("Bill has already been generated for this booking");
    }

    // Get time slot discount from the booking
    const timeSlot = await Booking.findById(bookingId)
      .populate("timeSlotId")
      .select("timeSlotId");

    const autoDiscountPercent = timeSlot?.timeSlotId?.discountPercent || 0;
    const finalDiscountPercent = discountPercent || autoDiscountPercent;

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((item) => item.itemId) },
    });

    const billItems = items.map((item) => {
      const menuItem = menuItems.find(
        (mi) => mi._id.toString() === item.itemId
      );
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.itemId}`);
      }

      const price = menuItem.price;
      const quantity = item.quantity || 1;
      const total = price * quantity;

      return {
        itemId: menuItem._id,
        name: menuItem.name,
        price: price,
        quantity: quantity,
        total: total,
      };
    });

    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);

    const discountAmount = (subtotal * finalDiscountPercent) / 100;
    const grandTotal = subtotal - discountAmount;

    const Bill = require("../models/Bill.js");
    const bill = new Bill({
      bookingId,
      restaurantId,
      userId,
      items: billItems,
      subtotal,
      discountPercent: finalDiscountPercent,
      discountAmount,
      grandTotal,
      isSharedWithUser,
      paymentStatus,
    });

    const savedBill = await bill.save();

    // Update booking to mark bill as generated
    await Booking.findByIdAndUpdate(bookingId, {
      hasGeneratedBill: true,
      billId: savedBill._id,
    });

    return {
      success: true,
      message: "Bill created successfully",
      data: savedBill,
    };
  } catch (error) {
    console.error("Error creating bill:", error.message);
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
};
exports.getRestaurantMenu = async (req) => {
  try {
    const limit = 2;
    const { page } = req.query;

    const skip = (page - 1) * limit;
    const { id } = req.params;
    if (!id.trim()) {
      const error = new Error(
        "Restaurant ID cannot be empty or just whitespace."
      );
      error.status = STATUS.BAD_REQUEST;
      throw error;
    }

    const user = await Restaurant.find({ userId: id });

    if (!user) throw new Error("No user is found");
    const menuData = await MenuItem.find({ restaurantId: user[0]._id })
      .populate({
        path: "restaurantId",
        select: "name categoryId.name ",
      })
      .populate({ path: "categoryId" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await MenuItem.countDocuments({ restaurantId: user[0]._id });
    // console.log(count);

    return {
      success: true,
      message: "Menus Founded",
      data: {
        menuData,
        totalPages: Math.ceil(count / limit),
        currentPage: page * 1,
        totalDocs: count,
      },
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};
exports.getBillsByRestaurant = async (req) => {
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
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const Bill = require("../models/Bill.js");
    const bills = await Bill.find({ restaurantId })
      .populate("bookingId", "date numberOfGuests -_id")
      .populate("restaurantId")
      .populate("userId", "name email -_id")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Bill.countDocuments({ restaurantId });

    return {
      success: true,
      message: "Bills retrieved successfully",
      data: {
        bills,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalDocs: count,
      },
    };
  } catch (error) {
    console.error("Error getting bills:", error.message);
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
};

exports.getBillById = async (req) => {
  try {
    const { billId } = req.params;

    if (!billId) {
      throw new Error("Bill ID is required");
    }

    const Bill = require("../models/Bill.js");
    const bill = await Bill.findById(billId)
      .populate("bookingId")
      .populate("restaurantId", "name logoImage -_id")
      .populate("userId", "name email -_id");

    if (!bill) {
      throw new Error("Bill not found");
    }

    return {
      success: true,
      message: "Bill retrieved successfully",
      data: bill,
    };
  } catch (error) {
    console.error("Error getting bill by ID:", error.message);
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
};

exports.updateBillPaymentStatus = async (req) => {
  try {
    const { billId } = req.params;
    const { paymentStatus } = req.body;

    if (!billId || !paymentStatus) {
      throw new Error("Bill ID and payment status are required");
    }

    const validStatuses = ["Unpaid", "Paid"];
    if (!validStatuses.includes(paymentStatus)) {
      throw new Error("Invalid payment status");
    }

    const Bill = require("../models/Bill.js");
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedBill) {
      throw new Error("Bill not found");
    }

    return {
      success: true,
      message: "Payment status updated successfully",
      data: updatedBill,
    };
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
};
