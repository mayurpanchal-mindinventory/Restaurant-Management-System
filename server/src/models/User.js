const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // userName: { type: String, require: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "restaurant", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
