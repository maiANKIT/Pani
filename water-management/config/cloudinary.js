const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "water-management-reports",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // Free-tier friendly: cap dimensions, auto-compress quality, and
    // auto-convert to the smallest efficient format (usually webp).
    transformation: [
      {
        width: 1000,
        height: 1000,
        crop: "limit",
        quality: "auto:eco",
        fetch_format: "auto",
      },
    ],
  },
});

module.exports = { cloudinary, storage };