const {
  getAllCategories,
  createMenu,
  getAllMenusByRestaurant,
  deleteMenuById,
  updateMenuById,
  getMenuById,
  getAllMenu,
} = require("../services/menuService.js");
const { STATUS, MESSAGES, sendResponse } = require("../utils/constants.js");

exports.getAllMenuCategories = async (req, res) => {
  try {
    const result = await getAllCategories();
    return sendResponse(res, STATUS.CREATED, result.message, result.data);
  } catch (error) {
    console.error("Error in getAllMenuCategories controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};
exports.createMenuItem = async (req, res) => {
  try {
    const result = await createMenu(req);
    return sendResponse(res, STATUS.CREATED, result.message, result.data);
  } catch (error) {
    console.error("Error in getAllMenuCategories controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};

exports.getAllMenusByRestaurant = async (req, res) => {
  try {
    const result = await getAllMenusByRestaurant(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in getAllRestaurantsWithOwners controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

exports.getMenuDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getMenuById(id);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in getAllRestaurantsWithOwners controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR
    );
  }
};
exports.deleteMenuById = async (req, res) => {
  try {
    const result = await deleteMenuById(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in deleteMenucontroller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const result = await updateMenuById(req);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in updateMenu controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};

exports.getAllMenuItems = async (req, res) => {
  try {
    const {
      search,
      category,
      restaurant,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const queryParams = {};

    if (search && search.trim()) {
      queryParams.search = search.trim();
    }

    if (category && category.trim()) {
      queryParams.category = category.trim();
    }

    if (restaurant && restaurant.trim()) {
      queryParams.restaurant = restaurant.trim();
    }

    if (minPrice !== undefined && minPrice !== "") {
      queryParams.minPrice = Number(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      queryParams.maxPrice = Number(maxPrice);
    }

    if (sortBy) {
      queryParams.sortBy = sortBy;
    }

    if (sortOrder && (sortOrder === "asc" || sortOrder === "desc")) {
      queryParams.sortOrder = sortOrder;
    }

    if (page) {
      queryParams.page = Math.max(1, Number(page));
    }

    if (limit) {
      queryParams.limit = Math.max(1, Math.min(100, Number(limit)));
    }

    const result = await getAllMenu(queryParams);
    return sendResponse(res, STATUS.OK, result.message, result.data);
  } catch (error) {
    console.error("Error in getAllMenuItems controller:", error);
    return sendResponse(
      res,
      error.status || STATUS.INTERNAL_SERVER_ERROR,
      error.message || MESSAGES.SERVER_ERROR,
      error.details
    );
  }
};
