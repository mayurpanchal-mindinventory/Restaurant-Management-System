const { registerService, loginService } = require("../services/authService");
const { STATUS } = require("../utils/constants");
exports.register = async (req, res) => {
    try {
        const user = await registerService(req.body);
        res.json({
            message: "User registered successfully",
            userId: user._id
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
            accessToken,
            user: {
                id: user._id,
                userName: user.userName,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (err) {
        res.status(STATUS.BAD_REQUEST).json({ error: err.message });
    }
};
