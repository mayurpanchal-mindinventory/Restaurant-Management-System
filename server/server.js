const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes.js");
const adminRoutes = require("./src/routes/adminRoutes.js");
const userRoutes = require("./src/routes/userRoutes.js");
const restaurantPanelRoutes = require("./src/routes/restaurantPanelRoutes.js");
dotenv.config();
const verifyToken = require("../server/src/middleware/authMiddleware.js");

const cookieParser = require("cookie-parser");
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.213:5173", // Your network IP
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.options(
  /.*/,
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", verifyToken, adminRoutes);
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/owner", verifyToken, restaurantPanelRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use((req, res) => {
  res.status(404).send("Sorry, that page cannot be found!");
});
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
