const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },

        name: { type: String, required: true },
        description: { type: String },

        logoImage: { type: String },
        mainImage: { type: String },

        openDays: [{ type: Number }],
        closedDates: [{ type: Date }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
