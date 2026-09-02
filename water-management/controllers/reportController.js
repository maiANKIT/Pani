const Report = require("../models/Report");
const { cloudinary } = require("../config/cloudinary");

// @desc    Upload a water report photo (status starts as pending)
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const report = await Report.create({
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      description: req.body.description || "",
      location: req.body.location || "",
      roomNumber: req.user.roomNumber, // taken from token, never from body
      uploadedBy: req.user._id,
      status: "pending",
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Room dashboard — only VERIFIED reports from MY room (paginated)
// @route   GET /api/reports?page=1&limit=10
exports.getRoomReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { roomNumber: req.user.roomNumber, status: "verified" };

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("uploadedBy", "name")
        .populate("verifiedBy", "name")
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

// @desc    Pending reports from MY room, awaiting verification (paginated)
// @route   GET /api/reports/pending?page=1&limit=10
exports.getPendingReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { roomNumber: req.user.roomNumber, status: "pending" };

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("uploadedBy", "name")
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

// @desc    Verify or reject a report — only a verified member of the
//          SAME room as the report can act on it
// @route   PATCH /api/reports/:id/verify
// body: { action: "verify" | "reject", reason?: string }
// @desc    Rejected reports from MY room
// @route   GET /api/reports/rejected?page=1&limit=10
exports.getRejectedReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { roomNumber: req.user.roomNumber, status: "rejected" };

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("uploadedBy", "name")
        .populate("verifiedBy", "name")
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
exports.verifyReport = async (req, res) => {
  try {
    const { action, reason } = req.body;

    if (!["verify", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'verify' or 'reject'" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.roomNumber !== req.user.roomNumber) {
      return res
        .status(403)
        .json({ message: "You can only verify reports from your own room" });
    }

    if (report.uploadedBy.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot verify your own uploaded report" });
    }

    if (report.status !== "pending") {
      return res.status(400).json({ message: `Report already ${report.status}` });
    }

    report.status = action === "verify" ? "verified" : "rejected";
    report.verifiedBy = req.user._id;
    report.verifiedAt = new Date();
    if (action === "reject") {
      report.rejectionReason = reason || "";
    }
    await report.save();

    res.json({ message: `Report ${report.status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report (uploader or admin only) — also removes from Cloudinary
// @route   DELETE /api/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const isOwner = report.uploadedBy.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this report" });
    }

    await cloudinary.uploader.destroy(report.cloudinaryId);
    await report.deleteOne();

    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};