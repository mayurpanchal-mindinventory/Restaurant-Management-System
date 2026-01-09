const Booking = require("../models/Booking.js");
const User = require("../models/User.js");
const Restaurant = require("../models/Restaurant.js");
const { STATUS, MESSAGES } = require("../utils/constants.js");
const MenuItem = require("../models/MenuItem.js");
const TimeSlot = require("../models/TimeSlot.js");
const { default: mongoose } = require("mongoose");
exports.getBookingByRestaurent = async (req) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      throw error;
    }

    const restaurant = await Restaurant.findOne({ userId: userId });

    if (!restaurant) {
      const error = new Error("Restaurant not found for this user");
      error.status = 404;
      throw error;
    }

    const restaurantId = restaurant._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const mainQuery = { restaurantId };

    if (req.query.status) {
      mainQuery.status = req.query.status;
    }

    if (req.query.date) {
      const date = new Date(req.query.date);
      mainQuery.date = date;
    }

    if (req.query.timeslot) {
      const timeSlot = await TimeSlot.findOne({
        timeSlot: { $regex: req.query.timeslot, $options: "i" },
      });
      if (timeSlot) {
        mainQuery.timeSlotId = timeSlot._id;
      }
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
            {
              $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$timeSlotDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                numberOfGuests: 1,
                date: 1,
                status: 1,
                createdAt: 1,
                hasGeneratedBill: 1,
                billId: 1,
                restaurantId: 1,
                timeSlotId: "$timeSlotDetails", // Mapping back to your preferred name
                userId: {
                  _id: "$userDetails._id",
                  name: "$userDetails.name",
                  email: "$userDetails.email",
                },
              },
            },
          ],
          // Branch 2: Total count for current filters (for pagination)
          totalFilteredCount: [{ $match: mainQuery }, { $count: "count" }],
          // Branch 3: Stats (Total Pending for this restaurant regardless of filter)
          pendingCount: [
            { $match: mainQuery },
            { $match: { restaurantId, status: "Pending" } },
            { $count: "count" },
          ],
          billGenerated: [
            { $match: mainQuery },
            { $match: { hasGeneratedBill: true } },
            { $count: "count" },
          ],

          // Branch 4: Stats (Total Completed for this restaurant regardless of filter)
          completedCount: [
            { $match: mainQuery },
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
    const totalBillsGenerated = results[0].billGenerated[0]?.count || 0;

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
        totalBillsGenerated,
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
    let menuData;
    const limit = 10;
    let { page, sortby, category, search } = req.query;

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
    // const menuData = await MenuItem.find({ restaurantId: user[0]._id })
    //   .populate({
    //     path: "restaurantId",
    //     select: "name categoryId.name ",
    //   })
    //   .populate({ path: "categoryId" })
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 })
    //   .exec();

    // const count = await MenuItem.countDocuments({ restaurantId: user[0]._id });
    // console.log(count);

    const pipeline = [
      {
        $match: {
          restaurantId: user[0]._id,
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurants",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: { path: "$restaurants", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } },
      {
        $match: search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                {
                  "categories.categoryName": { $regex: search, $options: "i" },
                },
              ],
            }
          : {},
      },
      ...(category
        ? [
            {
              $match: {
                "categories._id": new mongoose.Types.ObjectId(category),
              },
            },
          ]
        : []),
    ];
    const countData = await MenuItem.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    //console.log(countData);

    const totalDocs = countData.length > 0 ? countData[0].total : 0;

    menuData = await MenuItem.aggregate([
      ...pipeline,
      sortby === "1"
        ? { $sort: { price: -1 } }
        : sortby === "2"
        ? { $sort: { price: 1 } }
        : sortby === "3"
        ? { $sort: { name: 1 } }
        : { $sort: { name: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          categoryId: {
            _id: "$categories._id",
            categoryName: "$categories.categoryName",
          },
        },
      },
    ]);
    return {
      success: true,
      message: "Menus Founded",
      data: {
        menuData,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page * 1,
        totalDocs,
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
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    //  dynamic filter
    const mainQuery = { restaurantId };

    // Filter by payment status
    if (req.query.paymentStatus) {
      mainQuery.paymentStatus = req.query.paymentStatus;
    }

    // Filter by date (match booking date)
    if (req.query.date) {
      const searchDate = new Date(req.query.date);
      mainQuery.bookingId = {
        $exists: true,
      };
    }

    // First.... get user IDs matching search fields if search is provided
    if (req.query.search) {
      const users = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }).select("_id");
      const userIds = users.map((u) => u._id);
      if (userIds.length === 0) {
        // No users match, return empty result
        return {
          success: true,
          message: "Bills retrieved successfully",
          data: {
            bills: [],
            totalPages: 0,
            currentPage: page,
            totalDocs: 0,
            totalPaid: 0,
            totalUnpaid: 0,
            totalRevenue: 0,
          },
        };
      }
      mainQuery.userId = { $in: userIds };
    }

    //  sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sortByDate === "oldest") {
      sortOption = { createdAt: 1 }; // Oldest first
    }

    const Bill = require("../models/Bill.js");

    const results = await Bill.aggregate([
      // First match by basic filters (before lookup)
      { $match: mainQuery },
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
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "bookingDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$bookingDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Filter by date after booking is populated
      ...(req.query.date
        ? [
            {
              $match: {
                "bookingDetails.date": new Date(req.query.date),
              },
            },
          ]
        : []),
      {
        $facet: {
          // Branch 1: Paginated & Filtered Data
          bills: [
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                paymentStatus: 1,
                grandTotal: 1,
                isSharedWithUser: 1,
                createdAt: 1,
                items: 1,
                bookingId: {
                  _id: "$bookingDetails._id",
                  date: "$bookingDetails.date",
                  numberOfGuests: "$bookingDetails.numberOfGuests",
                },
                userId: {
                  _id: "$userDetails._id",
                  name: "$userDetails.name",
                  email: "$userDetails.email",
                },
              },
            },
          ],

          totalFilteredCount: [{ $count: "count" }],
          paidCount: [
            { $match: { restaurantId, paymentStatus: "Paid" } },
            { $count: "count" },
          ],
          unpaidCount: [
            { $match: { restaurantId, paymentStatus: "Unpaid" } },
            { $count: "count" },
          ],
          revenueSum: [
            { $match: { restaurantId, paymentStatus: "Paid" } },
            {
              $group: {
                _id: null,
                total: { $sum: "$grandTotal" },
              },
            },
          ],
        },
      },
    ]);

    const bills = results[0].bills;
    const totalDocs = results[0].totalFilteredCount[0]?.count || 0;
    const totalPaid = results[0].paidCount[0]?.count || 0;
    const totalUnpaid = results[0].unpaidCount[0]?.count || 0;
    const totalRevenue = results[0].revenueSum[0]?.total || 0;

    return {
      success: true,
      message: "Bills retrieved successfully",
      data: {
        bills,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        totalDocs,
        totalPaid,
        totalUnpaid,
        totalRevenue,
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
