const { registerService, loginService, refreshTokenService, logoutService } = require("../services/authService");
const { STATUS } = require("../utils/constants");
exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const user = await registerService(req.body);
    res.json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        username: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).json({ error: err.message });
  }
};



exports.refresh = async (req, res) => {
  try {
    const { accessToken, newRefreshToken } = await refreshTokenService(req, res);

    if (!accessToken || !newRefreshToken) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).json({ error: err.message });

  }
}

exports.logout = async (req, res) => {
  try {
    await logoutService(req, res);
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).json({ error: err.message });

  }

}