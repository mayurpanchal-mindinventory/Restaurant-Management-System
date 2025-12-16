const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        timeSlot: { type: String, required: true },
        maxBookings: { type: Number, required: true },
        discountPercent: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
