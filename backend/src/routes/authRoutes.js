const express = require("express");
const router = express.Router();

const {
  login,
  getMe,
  updateMe,
  changePassword,
  uploadAvatar,
  removeAvatar,
} = require("../controllers/authController");

const { requireAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/login", login);

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.put("/change-password", requireAuth, changePassword);

// Avatar management
router.post("/avatar", requireAuth, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", requireAuth, removeAvatar);

module.exports = router;