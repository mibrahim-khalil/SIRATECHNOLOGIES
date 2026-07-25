const express = require("express");
const router = express.Router();

const {
  createMember,
  getAllMembers,
  getAllMembersAdmin,
  getMember,
  updateMember,
  deleteMember,
  toggleMember,
} = require("../controllers/teamController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Admin
router.get("/admin/all", requireAuth, requireAdmin, getAllMembersAdmin);

// Public
router.get("/", getAllMembers);
router.get("/:id", getMember);

// Protected CRUD
router.post("/", requireAuth, requireAdmin, upload.single("photo"), createMember);
router.put("/:id", requireAuth, requireAdmin, upload.single("photo"), updateMember);
router.patch("/:id/toggle", requireAuth, requireAdmin, toggleMember);
router.delete("/:id", requireAuth, requireAdmin, deleteMember);

module.exports = router;