const express = require("express");
const {
  getAllbookingByRestaurant,
  updateBookingStatus,
} = require("../controllers/bookingController");
const router = express.Router();

router.get("/bookingList/:userId", getAllbookingByRestaurant);
router.patch("/updateStatus/:id", updateBookingStatus);

module.exports = router;
