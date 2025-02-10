const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access denied' });

    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = user; 
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
