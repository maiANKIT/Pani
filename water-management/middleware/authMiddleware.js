const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies JWT and attaches the logged-in user to req.user
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Must be used AFTER protect. Blocks unverified users from
// member-only actions (uploading, verifying, viewing dashboard).
exports.requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      message: "You must be verified by a member of your room first",
    });
  }
  next();
};

// Must be used AFTER protect. Only lets isAdmin accounts through —
// isAdmin can never be set via any API route, only directly in the DB.
exports.requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};