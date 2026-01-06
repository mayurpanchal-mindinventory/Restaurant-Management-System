const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const validateName = (name) => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return "Name should only contain letters and spaces";
  }
  return;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    throw new Error("Email is required");
  }
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }
  return;
};
const validatePhone = (phone) => {
  if (phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, "");

    if (!phoneRegex.test(cleanPhone)) {
      throw new Error("Please enter a valid phone number");
    }
    if (cleanPhone.length !== 10) {
      throw new Error("Phone number must be 10 digits");
    }

  }
  return;
};

const validatePassword = (password) => {
  if (!password.trim()) {
    throw new Error("Password is required");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter, one lowercase letter, and one number");
  }
  return;

};
exports.registerService = async (data) => {

  const { name, email, phone, password, role } = data;
  console.log();
  if (!email || !name || !password) throw new Error("All Fields are Required");

  validateName(name);
  validateEmail(email);
  validatePassword(password);
  if (phone)
    validatePhone(phone);
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");
  const passwordHash = await hashPassword(password);
  return await User.create({
    name,
    email,
    phone,
    passwordHash,
    role,
  });
};

exports.loginService = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error("Email and Password Required");
  }
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid Username or password");
  const match = await comparePassword(password, user.passwordHash);
  if (!match) throw new Error("Invalid Username or password");
  const accessToken = generateAccessToken(user);
  // const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await Token.findOneAndUpdate(
    { userId: user._id },
    { refreshToken },
    { upsert: true }
  );
  return { user, accessToken, refreshToken };
};

exports.refreshTokenService = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new Error("NO_TOKEN");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const tokenDoc = await Token.findOne({ userId: decoded.id });

  if (!tokenDoc || tokenDoc.refreshToken !== refreshToken) {
    throw new Error("INVALID_TOKEN");
  }

  const user = await User.findById(decoded.id);
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  tokenDoc.refreshToken = newRefreshToken;
  await tokenDoc.save();

  return { accessToken, newRefreshToken };
};

exports.logoutService = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(204).json({ message: "Already logged out" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    await Token.findOneAndDelete({ userId: decoded.id });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(401).json({ message: "Session expired" });
  }
};
