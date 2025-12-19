const { STATUS, MESSAGES } = require("../utils/constants");
const categories = require('../models/MenuCategory');
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

    console.log(req.body);
    console.log(req.files["image"]);

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
        const error = new Error(
            "Menu name cannot be empty or just whitespace."
        );
        error.status = STATUS.BAD_REQUEST;
        throw error;
    }

    const mainFile = req.files["image"] ? req.files["image"][0] : null;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let mainImageUrl = null;
        if (mainFile) {
            mainImageUrl = await uploadToCloudinary(
                mainFile.path,
                "menu_images"
            );
        }
        console.log("check " + mainImageUrl);

        const menu = new MenuItem({
            categoryId: categoryId,
            restaurantId: restaurantId,
            name: name,
            image: mainImageUrl,
            price: Number(price)
        });
        await menu.save({ session });

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: "Menu Added",
            data: menu
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);

        if (!error.status) {
            error.status = STATUS.INTERNAL_SERVER_ERROR;
            error.message
        }
        throw error;
    }
}

const getAllMenusByRestaurant = async (req) => {
    try {
        const limit = 2;
        const { page } = req.query;

        const skip = (page - 1) * limit;
        const { id } = req.params;
        const menuData = await MenuItem.find({ restaurantId: id })
            .populate({
                path: "restaurantId",
                select: "name categoryId.name "
            }).populate({ path: "categoryId" })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();

        const count = await MenuItem.countDocuments({ restaurantId: id });
        console.log(count);

        return {
            success: true,
            message: "Menus Founded",
            data: {
                menuData,
                totalPages: Math.ceil(count / limit),
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

const getMenuById = async (menuId) => {
    try {
        const menuData = await MenuItem.findById(menuId)
            .populate({
                path: "restaurantId",
                select: "name categoryId.name "
            }).populate({ path: "categoryId" })
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
        const existingMenu = await MenuItem.findById(id).session(
            session
        );
        if (!existingMenu) {
            const error = new Error(MESSAGES.RESTAURANT_NOT_FOUND);
            error.status = STATUS.NOT_FOUND;
            throw error;
        }


        // Delete images from Cloudinary if they exist
        const deletePromises = [];

        if (existingMenu.image) {
            const publicId = existingMenu.image
                .split("/")
                .pop()
                .split(".")[0];
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
                id
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
        const error = new Error(
            "Menu name cannot be empty or just whitespace."
        );
        error.status = STATUS.BAD_REQUEST;
        throw error;
    }

    const mainFile = req.files["image"] ? req.files["image"][0] : null;

    const session = await mongoose.startSession();
    session.startTransaction();


    try {
        const existingMenu = await MenuItem.findById(id);
        console.log(existingMenu);

        let mainImageUrl = existingMenu.image;
        if (mainFile) {
            mainImageUrl = await uploadToCloudinary(
                mainFile.path,
                "menu_images"
            );
        }
        console.log("check " + mainImageUrl);

        const updatedMenu = {
            categoryId: categoryId,
            name: name,
            image: mainImageUrl,
            price: Number(price)
        };
        await MenuItem.findByIdAndUpdate(id, updatedMenu, { session });

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: "Menu updated",
            data: updatedMenu
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (mainFile && fs.existsSync(mainFile.path)) fs.unlinkSync(mainFile.path);

        if (!error.status) {
            error.status = STATUS.INTERNAL_SERVER_ERROR;
            error.message = MESSAGES.MENU_NOT_UPDATED
        }
        throw error;
    }
}

module.exports = {

    getAllCategories,
    createMenu,
    getAllMenusByRestaurant,
    deleteMenuById,
    updateMenuById,
    getMenuById
}
