const express = require("express");
const router = express.Router();

const {
  login,
  getMe,
  updateMe,
  changePassword,
} = require("../controllers/authController");

const { requireAuth } = require("../middleware/authMiddleware");

router.post("/login", login);

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.put("/change-password", requireAuth, changePassword);

module.exports = router;