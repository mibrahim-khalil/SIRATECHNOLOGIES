const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");

// Store file in memory (buffer) — we'll upload manually
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 15,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/**
 * Upload a single buffer to Cloudinary
 * Returns: { url, public_id }
 */
function uploadBufferToCloudinary(buffer, originalname) {
  return new Promise((resolve, reject) => {
    const public_id = `${Date.now()}-${originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "siratechnologies",
        resource_type: "image",
        public_id,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

module.exports = upload;
module.exports.uploadBufferToCloudinary = uploadBufferToCloudinary;