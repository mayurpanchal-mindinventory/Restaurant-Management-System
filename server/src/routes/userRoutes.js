const {
  createBooking,
  getUserBookings,
  updateSharedWithUserByBookingid,
} = require("../controllers/bookingController.js");
const { verifyRole } = require("../middleware/verifyRole");

const { desiplayBillByUserid } = require("../controllers/bookingController.js");
const express = require("express");
const { getAllMenuItems } = require("../controllers/menuController.js");
const router = express.Router();
router.get("/bookings", verifyRole(['admin', 'restaurant', 'user']), getUserBookings);
router.get("/bill/:userId", verifyRole(['admin', 'restaurant', 'user']), desiplayBillByUserid);
router.patch("/bill/:bookingid", verifyRole(['admin', 'restaurant']), updateSharedWithUserByBookingid);
router.post("/create-booking", verifyRole(['admin', 'restaurant', 'user']), createBooking);
router.get("/bookings/:userId", verifyRole(['admin', 'restaurant', 'user']), getUserBookings);
router.get("/menu", verifyRole(['admin', 'restaurant', 'user']), getAllMenuItems);
module.exports = router;
