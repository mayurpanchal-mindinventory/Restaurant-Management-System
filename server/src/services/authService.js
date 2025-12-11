const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

exports.registerService = async (data) => {
    const { name, email, phone, password, role } = data;
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email already exists");
    const passwordHash = await hashPassword(password);
    return await User.create({
        name,
        email,
        phone,
        passwordHash,
    });
};

exports.loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid Username or password");
    const match = await comparePassword(password, user.passwordHash);
    if (!match) throw new Error("Invalid Username or password");
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.findOneAndUpdate(
        { userId: user._id },
        { refreshToken },
        { upsert: true }
    );
    return { user, accessToken, refreshToken };
};

exports.refreshTokenService = async (refreshToken) => {
    const tokenData = await Token.findOne({ refreshToken });
    if (!tokenData) throw new Error("Invalid refresh token");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) throw new Error("User not found");

    const newAccessToken = generateAccessToken(user);

    return { accessToken: newAccessToken };
};

exports.logoutService = async (refreshToken) => {
    await Token.findOneAndDelete({ refreshToken });
    return true;
};
