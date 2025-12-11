const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        name: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
