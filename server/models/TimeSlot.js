const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },

        startTime: { type: String, required: true },   // "12:00 PM"
        endTime: { type: String, required: true },     // "01:00 PM"

        maxBookings: { type: Number, required: true },
        discountPercent: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
