const {
  createBooking,
  getUserBookings,
  updateSharedWithUserByBookingid,
} = require("../controllers/bookingController.js");
const { desiplayBillByUserid } = require("../controllers/bookingController.js");
const express = require("express");
const { getAllMenuItems } = require("../controllers/menuController.js");
const router = express.Router();
router.get("/bookings", getUserBookings);
router.get("/bill/:userId", desiplayBillByUserid);
router.patch("/bill/:bookingid", updateSharedWithUserByBookingid);
router.post("/create-booking", createBooking);
router.get("/bookings/:userId", getUserBookings);
router.get("/menu", getAllMenuItems);
module.exports = router;
