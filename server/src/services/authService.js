const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

exports.registerService = async (data) => {
  const { name, email, phone, password, role } = data;
  console.log();
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
// exports.refreshTokenService = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ message: "No refresh token" });

//     const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

//     const tokenDoc = await Token.findOne({ userId: decoded.id });

//     if (!tokenDoc || tokenDoc.refreshToken !== token) {
//       throw new Error("Invalid refresh token");
//     }

//     const user = await User.findById(decoded.id);
//     const accessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     tokenDoc.refreshToken = newRefreshToken;

//     const savedDoc = await tokenDoc.save();

//     console.log("Updated Token in DB:", savedDoc.refreshToken);

//     return { accessToken, newRefreshToken };
//   } catch (e) {
//     return { error: e.message };
//   }
// };

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
