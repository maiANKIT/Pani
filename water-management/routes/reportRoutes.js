const express = require("express");
const router = express.Router();
const {
  createReport,
  getRoomReports,
  getPendingReports,
  verifyReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect, requireVerified } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Everything here requires login + being a verified member of a room
router.use(protect, requireVerified);

router.post("/", upload.single("photo"), createReport);
router.get("/", getRoomReports);
router.get("/pending", getPendingReports);
router.patch("/:id/verify", verifyReport);
router.delete("/:id", deleteReport);

module.exports = router;
