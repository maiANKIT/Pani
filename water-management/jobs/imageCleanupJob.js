const cron = require("node-cron");
const Report = require("../models/Report");
const { cloudinary } = require("../config/cloudinary");

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

// Finds reports older than 3 days whose image hasn't been cleaned up yet,
// deletes the image from Cloudinary, and clears the image fields on the
// report — the rest of the record (uploader, verifier, status, etc.) stays.
const deleteExpiredImages = async () => {
  try {
    const cutoff = new Date(Date.now() - THREE_DAYS_MS);

    const expiredReports = await Report.find({
      createdAt: { $lte: cutoff },
      imageDeleted: false,
      cloudinaryId: { $ne: "" },
    });

    if (expiredReports.length === 0) return;

    console.log(`[image-cleanup] Deleting ${expiredReports.length} expired image(s)...`);

    for (const report of expiredReports) {
      try {
        await cloudinary.uploader.destroy(report.cloudinaryId);
      } catch (err) {
        // Even if Cloudinary deletion fails (e.g. already gone), still
        // mark it cleaned up locally so we don't retry forever.
        console.error(`[image-cleanup] Cloudinary delete failed for ${report._id}:`, err.message);
      }

      report.imageUrl = "";
      report.cloudinaryId = "";
      report.imageDeleted = true;
      await report.save();
    }

    console.log("[image-cleanup] Done.");
  } catch (error) {
    console.error("[image-cleanup] Job failed:", error.message);
  }
};

// Runs once every day at 2:00 AM server time
const startImageCleanupJob = () => {
  cron.schedule("0 2 * * *", deleteExpiredImages);
  console.log("[image-cleanup] Scheduled daily at 2:00 AM");
};

module.exports = { startImageCleanupJob, deleteExpiredImages };