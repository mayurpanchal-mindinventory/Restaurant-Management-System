const express = require("express");
const { verifyRole } = require("../middleware/verifyRole");

const {
  getAllbookingByRestaurant,
  updateBookingStatus,
  createBillForBooking,
  getBillsForRestaurant,
  getBillByIdController,
  updateBillPaymentStatusController,
} = require("../controllers/bookingController");
const restaurantController = require("../controllers/restaurantController");
const router = express.Router();

// Booking routes
router.get("/bookingList/:userId", verifyRole(['admin', 'restaurant', 'user']), getAllbookingByRestaurant);
router.patch("/updateStatus/:id", verifyRole(['restaurant']), updateBookingStatus);
router.get(`/menulist/:id`, verifyRole(['admin', 'restaurant', 'user']), restaurantController.getAllMenu);
// Bill routes
router.post("/createBill", verifyRole(['restaurant']), createBillForBooking);
router.get("/bills/:userId", verifyRole(['admin', 'restaurant', 'user']), getBillsForRestaurant);
router.get("/bill/:billId", verifyRole(['admin', 'restaurant', 'user']), getBillByIdController);
router.patch("/bill/:billId/paymentStatus", verifyRole(['restaurant']), updateBillPaymentStatusController);

module.exports = router;
