const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig.js"); // Your Cloudinary config
const mongoose = require("mongoose");
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

exports.createRestaurantAccount = async (req, res) => {
  const { email, restaurantName, description, phone } = req.body;

  if (!email || !restaurantName) {
    return res.status(400).json({
      message:
        "Missing required fields: email and restaurantName are required.",
      missingFields: {
        email: !email ? "Email is required" : null,
        restaurantName: !restaurantName ? "Restaurant name is required" : null,
      },
    });
  }

  if (!restaurantName.trim()) {
    return res.status(400).json({
      message: "Restaurant name cannot be empty or just whitespace.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
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

    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    }).session(session);

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
        email: email,
      });
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

    res.status(201).json({
      message:
        "Restaurant account and profile created successfully with images.",
      userId: newUser._id,
      profile: newRestaurantProfile,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (logoFile && fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
    if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);
    console.error(error);
    res.status(500).json({
      message: "Failed to create restaurant account due to a server error.",
    });
  }
};

exports.getAllRestaurantsWithOwners = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).populate({
      path: "userId",
      select: "name email phone",
    });

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants." });
  }
};
