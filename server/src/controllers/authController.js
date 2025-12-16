const { registerService, loginService } = require("../services/authService");
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
    const { user, accessToken } = await loginService(req.body);

    res.json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        username: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(STATUS.BAD_REQUEST).json({ error: err.message });
  }
};
