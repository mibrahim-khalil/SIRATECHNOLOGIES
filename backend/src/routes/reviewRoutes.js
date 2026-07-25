const express = require("express");
const router = express.Router();

const {
  submitReview,
  createReview,
  getPublicReviews,
  getAllReviewsAdmin,
  getReview,
  updateReview,
  approveReview,
  rejectReview,
  deleteReview,
  toggleReview,
  toggleFeatured,
  getPendingCount,
} = require("../controllers/reviewController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Admin
router.get("/admin/all", requireAuth, requireAdmin, getAllReviewsAdmin);
router.get("/admin/pending-count", requireAuth, requireAdmin, getPendingCount);

// Public
router.get("/", getPublicReviews);
router.post("/submit", upload.single("avatar"), submitReview); // public submission
router.get("/:id", getReview);

// Protected CRUD
router.post("/", requireAuth, requireAdmin, upload.single("avatar"), createReview);
router.put("/:id", requireAuth, requireAdmin, upload.single("avatar"), updateReview);
router.patch("/:id/approve", requireAuth, requireAdmin, approveReview);
router.patch("/:id/reject", requireAuth, requireAdmin, rejectReview);
router.patch("/:id/toggle", requireAuth, requireAdmin, toggleReview);
router.patch("/:id/featured", requireAuth, requireAdmin, toggleFeatured);
router.delete("/:id", requireAuth, requireAdmin, deleteReview);

module.exports = router;