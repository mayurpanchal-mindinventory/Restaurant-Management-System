const {
  createBooking,
  getUserBookings,
} = require("../controllers/bookingController.js");
const express = require("express");
const router = express.Router();
router.get("/bookings", getUserBookings);
router.post("/create-booking", createBooking);
router.get("/bookings/:userId", getUserBookings);
module.exports = router;
