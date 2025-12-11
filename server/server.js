const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require('./src/routes/authRoutes')
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
