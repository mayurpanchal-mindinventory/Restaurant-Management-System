const { STATUS, MESSAGES } = require("../utils/constants");
const categories = require("../models/MenuCategory");
const MenuItem = require("../models/MenuItem");
const { mongoose } = require("mongoose");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig.js");
const { uploadToCloudinary } = require("./adminService");

const getAllCategories = async () => {
  try {
    const category = await categories.find();

    return {
      success: true,
      message: "Categories Founded",
      data: category,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

const createMenu = async (req) => {
  const { name, price, categoryId, restaurantId } = req.body;

  // console.log(req.body);
  // console.log(req.files["image"]);

  if (!name || !price || !categoryId || !restaurantId) {
    const error = new Error(
      "Missing required fields: name and Price are required."
    );
    error.status = STATUS.BAD_REQUEST;
    error.details = {
      name: !name ? "Name is required" : null,
      price: !price ? "Price is required" : null,
    };
    throw error;
  }
  if (!name.trim()) {
    const error = new Error("Menu name cannot be empty or just whitespace.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const existMenu = await MenuItem.findOne({ name: name, restaurantId: restaurantId });
  if (existMenu) {
    const error = new Error("Menu with same name exist.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const mainFile = req.files["image"] ? req.files["image"][0] : null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let mainImageUrl = null;
    if (mainFile) {
      mainImageUrl = await uploadToCloudinary(mainFile.path, "menu_images");
    }
    // console.log("check " + mainImageUrl);

    const menu = new MenuItem({
      categoryId: categoryId,
      restaurantId: restaurantId,
      name: name,
      image: mainImageUrl,
      price: Number(price),
    });
    await menu.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Menu Added",
      data: menu,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);

    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message;
    }
    throw error;
  }
};

const getAllMenusByRestaurant = async (req) => {
  try {
    let menuData;
    const limit = 10;
    let { page, sortby, category, search } = req.query;

    if ((search, category, !page)) {
      page = 1;
    }
    const skip = (page - 1) * limit;
    const { id } = req.params;
    if (!id.trim()) {
      const error = new Error(
        "Restaurant ID cannot be empty or just whitespace."
      );
      error.status = STATUS.BAD_REQUEST;
      throw error;
    }
    const restaurantObjectId = new mongoose.Types.ObjectId(id);

    const pipeline = [
      {
        $match: {
          restaurantId: restaurantObjectId,
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
    ];
    const countData = await MenuItem.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
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
      ...(category
        ? [
          {
            $match: {
              "categoryId._id": new mongoose.Types.ObjectId(category),
            },
          },
        ]
        : []),
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
      error.message;
    }
    throw error;
  }
};

const getMenuById = async (menuId) => {
  try {
    if (!menuId.trim()) {
      const error = new Error("Menu ID cannot be empty or just whitespace.");
      error.status = STATUS.BAD_REQUEST;
      throw error;
    }
    const menuData = await MenuItem.findById(menuId)
      .populate({
        path: "restaurantId",
        select: "name categoryId.name ",
      })
      .populate({ path: "categoryId" })
      .exec();

    return {
      success: true,
      message: "Menu Founded",
      data: menuData,
    };
  } catch (error) {
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

const deleteMenuById = async (req) => {
  const { id } = req.params;

  if (!id) {
    const error = new Error("Menu ID is required.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingMenu = await MenuItem.findById(id).session(session);
    if (!existingMenu) {
      const error = new Error(MESSAGES.RESTAURANT_NOT_FOUND);
      error.status = STATUS.NOT_FOUND;
      throw error;
    }

    // Delete images from Cloudinary if they exist
    const deletePromises = [];

    if (existingMenu.image) {
      const publicId = existingMenu.image.split("/").pop().split(".")[0];
      deletePromises.push(
        cloudinary.uploader
          .destroy(`menu_images/${publicId}`)
          .catch((error) =>
            console.error("Failed to delete menu from Cloudinary:", error)
          )
      );
    }

    await Promise.all(deletePromises);

    // Delete restaurant and user documents
    await MenuItem.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: MESSAGES.MENU_DELETED,
      data: {
        id,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.MENU_NOTDELETE;
    }
    throw error;
  }
};

const updateMenuById = async (req) => {
  const { name, price, categoryId } = req.body;
  const { id } = req.params;

  if (!id) {
    const error = new Error("Menu ID is required.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }

  if (!name || !price) {
    const error = new Error(
      "Missing required fields: name and Price are required."
    );
    error.status = STATUS.BAD_REQUEST;
    error.details = {
      name: !name ? "Name is required" : null,
      price: !price ? "Price is required" : null,
    };
    throw error;
  }

  if (!name.trim()) {
    const error = new Error("Menu name cannot be empty or just whitespace.");
    error.status = STATUS.BAD_REQUEST;
    throw error;
  }



  const mainFile = req.files["image"] ? req.files["image"][0] : null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existMenu = await MenuItem.findOne({ name: name });
    if (existMenu) {
      const error = new Error("Menu with same name exist.");
      error.status = STATUS.BAD_REQUEST;
      throw error;
    }
    const existingMenu = await MenuItem.findById(id);
    // console.log(existingMenu);

    let mainImageUrl = existingMenu.image;
    if (mainFile) {
      mainImageUrl = await uploadToCloudinary(mainFile.path, "menu_images");
    }
    console.log("check " + mainImageUrl);

    const updatedMenu = {
      categoryId: categoryId,
      name: name,
      image: mainImageUrl,
      price: Number(price),
    };
    await MenuItem.findByIdAndUpdate(id, updatedMenu, { session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Menu updated",
      data: updatedMenu,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);

    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.MENU_NOT_UPDATED;
    }
    throw error;
  }
};

const getAllMenu = async (queryParams = {}) => {
  try {
    const {
      search = "",
      category = "",
      restaurant = "",
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = queryParams;

    const skip = (page - 1) * limit;

    // Build the match conditions for filtering
    let matchConditions = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };

    // Add search condition
    if (search) {
      matchConditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { "categoryData.categoryName": { $regex: search, $options: "i" } },
        { "restaurantData.name": { $regex: search, $options: "i" } },
      ];
    }

    // Add category filter
    if (category) {
      matchConditions["categoryData.categoryName"] = {
        $regex: category,
        $options: "i",
      };
    }

    // Add restaurant filter
    if (restaurant) {
      matchConditions["restaurantData.name"] = {
        $regex: restaurant,
        $options: "i",
      };
    }

    // Determine sort order
    const sortDirection = sortOrder === "desc" ? -1 : 1;
    let sortCondition = {};

    switch (sortBy) {
      case "price":
        sortCondition = { price: sortDirection };
        break;
      case "price-low":
        sortCondition = { price: 1 };
        break;
      case "price-high":
        sortCondition = { price: -1 };
        break;
      case "name-desc":
        sortCondition = { name: -1 };
        break;
      case "category":
        sortCondition = { "categoryData.categoryName": sortDirection };
        break;
      case "restaurant":
        sortCondition = { "restaurantData.name": sortDirection };
        break;
      case "name":
      default:
        sortCondition = { name: sortDirection };
        break;
    }

    // First, get the total count for pagination
    const totalCount = await MenuItem.aggregate([
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantData",
        },
      },
      { $unwind: "$restaurantData" },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: "$categoryData" },
      {
        $match: matchConditions,
      },
      {
        $count: "total",
      },
    ]);

    const totalDocs = totalCount.length > 0 ? totalCount[0].total : 0;
    const totalPages = Math.ceil(totalDocs / limit);

    // Get the filtered and sorted results
    const results = await MenuItem.aggregate([
      // First.. populate restaurant information for each menu item
      //console.log();
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantData",
        },
      },
      { $unwind: "$restaurantData" },

      // Lookup category details
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: "$categoryData" },

      // Apply filtering
      {
        $match: matchConditions,
      },

      // Add computed fields for sorting
      {
        $addFields: {
          categoryName: "$categoryData.categoryName",
          restaurantName: "$restaurantData.name",
        },
      },

      // Sort the results
      {
        $sort: sortCondition,
      },

      // Apply pagination
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },

      // Group by category to maintain the original structure
      {
        $group: {
          _id: "$categoryId",
          categoryDetails: { $first: "$categoryData" },
          items: {
            $push: {
              $mergeObjects: [
                "$$ROOT",
                {
                  restaurantId: {
                    _id: "$restaurantData._id",
                    name: "$restaurantData.name",
                  },
                },
              ],
            },
          },
        },
      },

      // Sort categories by name
      {
        $sort: {
          "categoryDetails.categoryName": 1,
        },
      },
    ]);

    // Also get all items for flat list (for client-side display)
    const allItems = await MenuItem.aggregate([
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantData",
        },
      },
      { $unwind: "$restaurantData" },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: "$categoryData" },
      {
        $match: matchConditions,
      },
      {
        $addFields: {
          categoryName: "$categoryData.categoryName",
          restaurantName: "$restaurantData.name",
        },
      },
      {
        $sort: sortCondition,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return {
      success: true,
      message: "Menu fetched successfully",
      data: {
        groupedData: results,
        flatData: allItems,
        pagination: {
          currentPage: page,
          totalPages,
          totalDocs,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          search,
          category,
          restaurant,
          minPrice: Number(minPrice),
          maxPrice: Number(maxPrice),
          sortBy,
          sortOrder,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllMenu service:", error);
    if (!error.status) {
      error.status = STATUS.INTERNAL_SERVER_ERROR;
      error.message = MESSAGES.SERVER_ERROR;
    }
    throw error;
  }
};

module.exports = {
  getAllCategories,
  createMenu,
  getAllMenusByRestaurant,
  deleteMenuById,
  updateMenuById,
  getMenuById,
  getAllMenu,
};
