import jwt from 'jsonwebtoken';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no token',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We'll fetch admin later when we have Admin model logic
    // For now: just check if decoded has role or id
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized - admin access required',
      });
    }

    req.admin = decoded; // attach to req for future use
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized - invalid token',
    });
  }
};