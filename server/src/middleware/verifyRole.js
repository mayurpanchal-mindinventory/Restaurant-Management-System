const verifyRole = (allowedRole) => {
    return (req, res, next) => {

        const userRole = req.user && req.user.user.role;

        // console.log(userRole);
        //  console.log(req.user);

        //  console.log(!allowedRole.includes(userRole));

        if (!userRole || !allowedRole.includes(userRole)) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to access this resource.'
            });
        }


        next();
    };
};

module.exports = { verifyRole };
