const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token and role
const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract the token, assuming it's a Bearer token
    const token = authHeader.split(' ')[1]; // Split on space, get the second part (the token itself)

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        console.log(token);
        const decoded = jwt.verify(token,"chanchal");
        req.user = decoded;  // Attach the decoded token data (user ID, role) to req.user
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const verifyAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access denied' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
