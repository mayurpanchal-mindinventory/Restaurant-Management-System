const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig.js");
const mongoose = require("mongoose");
const { STATUS, MESSAGES } = require("../utils/constants");
const Booking = require('../models/Booking.js')
const uploadToCloudinary = (filePath, folderName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: folderName },
      (error, result) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete local temp file: ${filePath}`, err);
          } else {
            console.log(`Deleted local temp file: ${filePath}`);
          }
        });

        if (error) {
          console.error("Cloudinary upload failed:", error.message);
          return reject(error);
        }

        console.log("Cloudinary upload successful:", result.secure_url);
        resolve(result.secure_url);
      }
    );
  });
};

const createRestaurantAccount = async (req) => {
  const { email, restaurantName, description, phone, password } = req.body;

  if (!email || !restaurantName) {
    const error = new Error(
      "Missing required fields: email and restaurantName are required."
    );
    error.status = STATUS.BAD_REQUEST;
    error.details = {
      email: !email ? "Email is required" : null,
      restaurantName: !restaurantName ? "Restaurant name is required" : null,
    };
    throw error;
  }

  if (!restaurantName.trim()) {
    const error = new Error(
      "Restaurant name cannot be empty or just whitespace."
    );
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Invalid email format.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const logoFile = req.files["logoImage"] ? req.files["logoImage"][0] : null;
  const mainFile = req.files["mainImage"] ? req.files["mainImage"][0] : null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let logoImageUrl = null;
    let mainImageUrl = null;

    if (logoFile) {
      logoImageUrl = await uploadToCloudinary(
        logoFile.path,
        "restaurant_logos"
      );
    }

    if (mainFile) {
      mainImageUrl = await uploadToCloudinary(
        mainFile.path,
        "restaurant_main_images"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    }).session(session);

    if (existingUser) {
      const error = new Error(MESSAGES.RESTAURANT_EXIST);
      error.status = STATUS.BAD_REQUEST;
      throw error;
    }

    const newUser = new User({
      name: restaurantName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      passwordHash: hashedPassword,
      role: "restaurant",
    });
    await newUser.save({ session });

    const newRestaurantProfile = new Restaurant({
      userId: newUser._id,
      name: restaurantName,
      description,
      logoImage: logoImageUrl,
      mainImage: mainImageUrl,
      openDays: req.body.openDays || [],

      closedDates: req.body.closedDates || [],
    });
    await newRestaurantProfile.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: MESSAGES.RESTAURANT_CREATED,
      data: {
        userId: newUser._id,
        profile: newRestaurantProfile,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (logoFile && fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
    if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);

    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.RESTAURANT_NOTADD;
    }
    throw error;
  }
};

const getAllRestaurantsWithOwners = async (req) => {
  try {
    const { page } = req.query;
    const limit = 2;
    const skip = (page - 1) * limit;
    const restaurants = await Restaurant.find({}).populate({
      path: "userId",
      select: "name email phone",
    }).skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Restaurant.countDocuments();;

    return {
      success: true,
      message: MESSAGES.RESTAURANT_FOUND,
      data: {
        restaurants, totalPages: Math.ceil(count / limit),
        currentPage: page * 1,
        totalDocs: count
      }
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

const getRestaurantWithOwnerById = async (Id) => {
  try {
    const restaurant = await Restaurant.findById(Id).populate({
      path: "userId",
      select: "name email phone",
    });

    if (!restaurant) {
      return {
        success: false,
        message: MESSAGES.RESTAURANT_NOT_FOUND,
        data: null,
      };
    }

    return {
      success: true,
      message: MESSAGES.RESTAURANT_FOUND,
      data: restaurant,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};


const updateRestaurant = async (req) => {
  const { restaurantId } = req.params;
  const { email, restaurantName, description, phone, openDays, closedDates, password } =
    req.body;

  // Validation
  if (!restaurantId) {
    const error = new Error("Restaurant ID is required.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const logoFile = req.files["logoImage"] ? req.files["logoImage"][0] : null;
  const mainFile = req.files["mainImage"] ? req.files["mainImage"][0] : null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the restaurant
    const existingRestaurant = await Restaurant.findById(restaurantId).session(
      session
    );
    if (!existingRestaurant) {
      const error = new Error(MESSAGES.RESTAURANT_NOT_FOUND);
      error.status = STATUS.NOT_FOUND;
      throw error;
    }

    // Find the associated user
    const existingUser = await User.findById(existingRestaurant.userId).session(
      session
    );
    if (!existingUser) {
      const error = new Error("Associated user not found.");
      error.status = STATUS.NOT_FOUND;
      throw error;
    }

    let logoImageUrl = existingRestaurant.logoImage;
    let mainImageUrl = existingRestaurant.mainImage;

    // Upload new logo if provided
    if (logoFile) {
      logoImageUrl = await uploadToCloudinary(
        logoFile.path,
        "restaurant_logos"
      );
    }

    // Upload new main image if provided
    if (mainFile) {
      mainImageUrl = await uploadToCloudinary(
        mainFile.path,
        "restaurant_main_images"
      );
    }

    // Update restaurant details
    const updateData = {
      name: restaurantName || existingRestaurant.name,
      description:
        description !== undefined
          ? description
          : existingRestaurant.description,
      logoImage: logoImageUrl,
      mainImage: mainImageUrl,
      openDays: openDays || existingRestaurant.openDays,
      closedDates: closedDates || existingRestaurant.closedDates,
    };

    await Restaurant.findByIdAndUpdate(restaurantId, updateData, { session });

    // Update user details if provided
    if (restaurantName || email || phone || password) {
      const userUpdateData = {};
      if (restaurantName) userUpdateData.name = restaurantName.trim();
      if (email) userUpdateData.email = email.toLowerCase().trim();
      if (phone) userUpdateData.phone = phone.trim();
      if (password) userUpdateData.passwordHash = await bcrypt.hash(password, 10);


      await User.findByIdAndUpdate(existingRestaurant.userId, userUpdateData, {
        session,
      });
    }

    // Get updated restaurant with populated user data
    const updatedRestaurant = await Restaurant.findById(restaurantId)
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: MESSAGES.RESTAURANT_UPDATED,
      data: updatedRestaurant,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Clean up uploaded files in case of error
    if (logoFile && fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
    if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);

    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.RESTAURANT_NOTUPDATE;
    }
    throw error;
  }
};

const deleteRestaurant = async (req) => {
  const { restaurantId } = req.params;

  // Validation
  if (!restaurantId) {
    const error = new Error("Restaurant ID is required.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the restaurant with user info
    const existingRestaurant = await Restaurant.findById(restaurantId).session(
      session
    );
    if (!existingRestaurant) {
      const error = new Error(MESSAGES.RESTAURANT_NOT_FOUND);
      error.status = STATUS.NOT_FOUND;
      throw error;
    }

    // Find the associated user
    const existingUser = await User.findById(existingRestaurant.userId).session(
      session
    );
    if (!existingUser) {
      const error = new Error("Associated user not found.");
      error.status = STATUS.NOT_FOUND;
      throw error;
    }

    // Delete images from Cloudinary if they exist
    const deletePromises = [];

    if (existingRestaurant.logoImage) {
      const publicId = existingRestaurant.logoImage
        .split("/")
        .pop()
        .split(".")[0];
      deletePromises.push(
        cloudinary.uploader
          .destroy(`restaurant_logos/${publicId}`)
          .catch((error) =>
            console.error("Failed to delete logo from Cloudinary:", error)
          )
      );
    }

    if (existingRestaurant.mainImage) {
      const publicId = existingRestaurant.mainImage
        .split("/")
        .pop()
        .split(".")[0];
      deletePromises.push(
        cloudinary.uploader
          .destroy(`restaurant_main_images/${publicId}`)
          .catch((error) =>
            console.error("Failed to delete main image from Cloudinary:", error)
          )
      );
    }

    await Promise.all(deletePromises);

    // Delete restaurant and user documents
    await Restaurant.findByIdAndDelete(restaurantId, { session });
    await User.findByIdAndDelete(existingRestaurant.userId, { session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: MESSAGES.RESTAURANT_DELETED,
      data: {
        restaurantId,
        userId: existingRestaurant.userId,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.RESTAURANT_NOTDELETE;
    }
    throw error;
  }
};
const allBooking = async (req) => {
  try {
    const { page } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const booking = await Booking.find()
      .populate('userId', 'name -_id')
      .populate('restaurantId', 'name logoImage -_id')
      .populate('timeSlotId', 'timeSlot -_id')
      .select('numberOfGuests date status -_id')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Booking.countDocuments();

    return {
      success: true,
      data: {
        booking, totalPages: Math.ceil(count / limit),
        currentPage: page * 1,
        totalDocs: count
      }

    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message;
    }
    throw error;
  }
};
module.exports = {
  uploadToCloudinary,
  createRestaurantAccount,
  getAllRestaurantsWithOwners,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantWithOwnerById,
  allBooking
};
