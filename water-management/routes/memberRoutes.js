const express = require("express");
const router = express.Router();
const {
  getPendingMembers,
  verifyMember,
} = require("../controllers/authController");
const { protect, requireVerified } = require("../middleware/authMiddleware");

// Only verified members of a room can see/approve pending members of that room
router.get("/pending", protect, requireVerified, getPendingMembers);
router.patch("/:id/verify", protect, requireVerified, verifyMember);

module.exports = router;