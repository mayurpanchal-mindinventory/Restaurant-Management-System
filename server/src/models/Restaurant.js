const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        description: { type: String },
        logoImage: { type: String },
        mainImage: { type: String },
        openDays: [{ type: Number }],
        closedDates: [{ type: Date }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
