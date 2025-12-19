const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Load the .env file

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configuration loaded successfully.");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Present" : "Missing");
console.log(
  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing"
);

module.exports = cloudinary;
