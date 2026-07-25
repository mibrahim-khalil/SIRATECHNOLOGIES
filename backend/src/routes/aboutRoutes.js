const express = require("express");
const router = express.Router();

const {
  getAbout,
  updateAbout,
  removeStoryImage,
} = require("../controllers/aboutController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getAbout); // public
router.put("/", requireAuth, requireAdmin, upload.single("storyImage"), updateAbout);
router.delete(
  "/image/story",
  requireAuth,
  requireAdmin,
  removeStoryImage
);

module.exports = router;