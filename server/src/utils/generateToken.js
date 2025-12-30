const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
    return jwt.sign({ user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
    );
}

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};
