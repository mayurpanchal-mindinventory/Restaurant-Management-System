const express = require("express");
const router = express.Router();
const adminController = require("../controllers/restaurantController.js");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/create-restaurant",
  upload,
  adminController.createRestaurantAccount
);
router.get("/display-restaurant", adminController.getAllRestaurantsWithOwners);
router.put(
  "/update-restaurant/:restaurantId",
  upload,
  adminController.updateRestaurant
);
router.delete(
  "/delete-restaurant/:restaurantId",
  adminController.deleteRestaurant
);
module.exports = router;
