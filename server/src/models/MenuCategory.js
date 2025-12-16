const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema(
    {

        categoryName: { type: String, required: true }
    },
    { collection: "categories" },
    { timestamps: true });

module.exports = mongoose.model("categories", menuCategorySchema);
