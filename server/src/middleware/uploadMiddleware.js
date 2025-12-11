const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import the filesystem module

// 1. Define the target directory path
const uploadDir = path.join(__dirname, "uploads", "temp");

// 2. Ensure the directory exists before Multer tries to use it
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

ensureDirExists(uploadDir);

// 3. Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the verified directory path
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// 4. Configure Multer upload middleware with limits and filters
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    // If validation fails, return an error
    cb(new Error("Only images are allowed (JPEG, JPG, PNG, GIF)"));
  },
}).fields([
  { name: "logoImage", maxCount: 1 }, // Expects a field named 'logoImage'
  { name: "mainImage", maxCount: 1 }, // Expects a field named 'mainImage'
]);

module.exports = upload;
