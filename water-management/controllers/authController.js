const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user — ALWAYS starts unverified, no auto-verify.
//          A room's very first member must be verified by an admin
//          (see adminVerifyMember below); every member after that is
//          verified by an existing verified member of the same room.
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, roomNumber } = req.body;

    if (!name || !email || !password || !roomNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      roomNumber,
      isVerified: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roomNumber: user.roomNumber,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: "Registered. Waiting for verification.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roomNumber: user.roomNumber,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Get unverified users waiting for approval in MY room
// @route   GET /api/members/pending
exports.getPendingMembers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      roomNumber: req.user.roomNumber,
      isVerified: false,
    }).select("-password");

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify a pending user — only allowed if requester is a verified
//          member of the SAME room as the target user
// @route   PATCH /api/members/:id/verify
exports.verifyMember = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.roomNumber !== req.user.roomNumber) {
      return res
        .status(403)
        .json({ message: "You can only verify members of your own room" });
    }

    if (targetUser.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    targetUser.isVerified = true;
    targetUser.verifiedBy = req.user._id;
    targetUser.verifiedAt = new Date();
    await targetUser.save();

    res.json({ message: "Member verified successfully", user: targetUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};