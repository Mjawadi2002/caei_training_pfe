const jwt = require('jsonwebtoken');

// Token authentication middleware
const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, return access denied
    if (!token) {
        return res.status(403).json({ message: 'Access denied: No token provided' });
    }

    // Verify the token using the secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach the user data (from token) to the request object
        req.user = user; 
        next();  // Pass control to the next middleware or route handler
    });
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is in the list of allowed roles
        if (!roles.includes(req.user?.role)) {
            return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
        }
        next(); // Pass control to the next middleware or route handler
    };
};

module.exports = { authenticateToken, authorizeRoles };
