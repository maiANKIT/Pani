const User = require("../models/User");
const Report = require("../models/Report");
const { cloudinary } = require("../config/cloudinary");

// @desc    Get all users, optionally filtered by room, sorted room-wise
// @route   GET /api/admin/users?roomNumber=101
exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.roomNumber) filter.roomNumber = req.query.roomNumber;

    const users = await User.find(filter)
      .select("-password")
      .sort({ roomNumber: 1, createdAt: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get every pending (unverified) user, across ALL rooms
// @route   GET /api/admin/pending-members
exports.getAllPendingMembers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isVerified: false })
      .select("-password")
      .sort({ roomNumber: 1, createdAt: 1 });

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin-only: verify ANY user regardless of room. Used to bootstrap
//          the very first member of a new room (no one else exists yet to
//          verify them).
// @route   PATCH /api/admin/members/:id/verify
exports.verifyMemberAsAdmin = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    targetUser.isVerified = true;
    targetUser.verifiedBy = req.user._id;
    targetUser.verifiedAt = new Date();
    await targetUser.save();

    res.json({ message: "Member verified by admin", user: targetUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports across ALL rooms, optional status filter, paginated
// @route   GET /api/admin/reports?status=pending&page=1&limit=10
exports.getAllReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("uploadedBy", "name email roomNumber")
        .populate("verifiedBy", "name email")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Report.countDocuments(filter),
    ]);

    res.json({
      reports,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      totalReports: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin-only: delete any report from any room (removes from Cloudinary too)
// @route   DELETE /api/admin/reports/:id
exports.deleteReportAsAdmin = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await cloudinary.uploader.destroy(report.cloudinaryId);
    await report.deleteOne();

    res.json({ message: "Report deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};