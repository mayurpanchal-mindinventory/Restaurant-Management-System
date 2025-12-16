const express = require("express");
const router = express.Router();
const adminController = require("../controllers/restaurantController.js");
const { upload, uploadMenu } = require("../middleware/uploadMiddleware");
const menuController = require("../controllers/menuController.js");

router.post(
  "/create-restaurant",
  upload,
  adminController.createRestaurantAccount
);
router.get("/display-restaurant", adminController.getAllRestaurantsWithOwners);
router.get("/display-restaurant/:Id", adminController.getRestaurantsWithOwnerById);

router.put(
  "/update-restaurant/:restaurantId",
  upload,
  adminController.updateRestaurant
);
router.delete(
  "/delete-restaurant/:restaurantId",
  adminController.deleteRestaurant
);

//Routes For Categories and menu

router.get("/categories", menuController.getAllMenuCategories);
router.post(
  "/menu",
  uploadMenu,
  menuController.createMenuItem
);

router.get(`/menulist/:id`, menuController.getAllMenusByRestaurant);
router.delete(`/delete-menu/:id`, menuController.deleteMenuById);

module.exports = router;
