const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
    {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: [
            {
                itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
                name: String,
                price: Number,
                quantity: Number,
                total: Number
            }
        ],

        subtotal: Number,
        discountPercent: Number,
        discountAmount: Number,
        grandTotal: Number,

        isSharedWithUser: { type: Boolean, default: false },

        paymentStatus: {
            type: String,
            enum: ["Unpaid", "Paid"],
            default: "Unpaid"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
