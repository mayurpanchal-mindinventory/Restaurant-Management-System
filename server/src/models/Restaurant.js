const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    logoImage: { type: String },
    mainImage: { type: String },

    openDays: [
      {
        type: String
      },
    ],

    closedDates: [{ type: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
