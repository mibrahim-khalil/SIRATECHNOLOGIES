const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings,
  removeImage,
} = require("../controllers/siteSettingsController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const settingsUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "ogImage", maxCount: 1 },
]);

// Public — public site fetches settings
router.get("/", getSettings);

// Admin
router.put("/", requireAuth, requireAdmin, settingsUpload, updateSettings);
router.delete("/image/:type", requireAuth, requireAdmin, removeImage);

module.exports = router;