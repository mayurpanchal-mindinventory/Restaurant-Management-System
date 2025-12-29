const jwt = require('jsonwebtoken');
const { STATUS } = require('../utils/constants');

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(STATUS.UNAUTHORIZED).json({ message: 'Token missing', status: STATUS.UNAUTHORIZED });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(STATUS.FORBIDDEN).json({
                    message: "Token expired",
                    status: STATUS.FORBIDDEN,
                    type: 'TOKEN_EXPIRED'
                });
            } else {
                return res.status(STATUS.UNAUTHORIZED).json({
                    message: 'Invalid authorization token',
                    status: STATUS.UNAUTHORIZED,
                    type: 'TOKEN_INVALID'
                });
            }
        }
        req.user = user;
        next();
    });
}

module.exports = verifyToken;
