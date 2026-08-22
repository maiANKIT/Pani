const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllPendingMembers,
  verifyMemberAsAdmin,
  getAllReports,
  deleteReportAsAdmin,
} = require("../controllers/adminController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

// Every route below requires a logged-in admin account (isAdmin: true,
// which can only ever be set directly in the database).
router.use(protect, requireAdmin);

router.get("/users", getAllUsers);
router.get("/pending-members", getAllPendingMembers);
router.patch("/members/:id/verify", verifyMemberAsAdmin);

router.get("/reports", getAllReports);
router.delete("/reports/:id", deleteReportAsAdmin);

module.exports = router;