const express = require("express");
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
router.get("/bookingList/:userId", getAllbookingByRestaurant);
router.patch("/updateStatus/:id", updateBookingStatus);
router.get(`/menulist/:id`, restaurantController.getAllMenu);
// Bill routes
router.post("/createBill", createBillForBooking);
router.get("/bills/:userId", getBillsForRestaurant);
router.get("/bill/:billId", getBillByIdController);
router.patch("/bill/:billId/paymentStatus", updateBillPaymentStatusController);

module.exports = router;
