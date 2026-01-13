const express = require("express");
const router = express.Router();
const adminController = require("../controllers/restaurantController.js");
const { upload, uploadMenu } = require("../middleware/uploadMiddleware");
const menuController = require("../controllers/menuController.js");
const slotController = require("../controllers/slotController.js");
const { verifyRole } = require("../middleware/verifyRole");

router.post(
  "/create-restaurant",
  verifyRole(['admin']),
  upload,
  adminController.createRestaurantAccount
);
router.get("/display-restaurant", verifyRole(['admin', 'user']),
  adminController.getAllRestaurantsWithOwners);
router.get(
  "/display-restaurant/:Id",
  verifyRole(['admin', 'restaurant', 'user']),
  adminController.getRestaurantsWithOwnerById
);

router.put(
  "/update-restaurant/:restaurantId",
  verifyRole(['admin']),
  upload,
  adminController.updateRestaurant
);
router.delete(
  "/delete-restaurant/:restaurantId",
  verifyRole(['admin']),
  adminController.deleteRestaurant
);

router.patch("/update-status/:id", verifyRole(['admin']), adminController.restaurantStatusChange)
//Routes For Categories and menu

router.get("/categories", verifyRole(['admin', 'restaurant', 'user']), menuController.getAllMenuCategories);
router.post("/menu", verifyRole(['admin', 'restaurant']), uploadMenu, menuController.createMenuItem);

router.get(`/menulist/:id`, verifyRole(['admin', 'restaurant', 'user']), menuController.getAllMenusByRestaurant);
router.delete(`/delete-menu/:id`, verifyRole(['admin', 'restaurant']), menuController.deleteMenuById);
router.put(`/update-menu/:id`, verifyRole(['admin', 'restaurant']), uploadMenu, menuController.updateMenu);
router.get(`/menu/:id`, verifyRole(['admin', 'restaurant', 'user']),
  menuController.getMenuDetails);

//Routers for Slot

router.post("/slot", verifyRole(['admin']), slotController.createSlot);
router.get("/slotlist/:id", verifyRole(['admin', 'restaurant', 'user']), slotController.getSlotList);
router.delete(`/delete-slot/:id`, verifyRole(['admin']), slotController.deleteSlotById);

router.put(`/update-slot/:id`, verifyRole(['admin']), slotController.updateSlotById);
router.get(`/slot/:id`, verifyRole(['admin', 'restaurant', 'user']), slotController.getSlotById);
router.get(`/viewbooking`, adminController.getAllBookingswithDetails);

// Public menu route - accessible to all users
router.get(`/allmenu`, verifyRole(['admin', 'restaurant', 'user']), menuController.getAllMenuItems);

module.exports = router;
