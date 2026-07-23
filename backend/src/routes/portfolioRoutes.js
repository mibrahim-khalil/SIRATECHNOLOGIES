const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  getAllPortfolios,
  getAllPortfoliosAdmin,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
  togglePortfolioStatus,
  togglePortfolioFeatured,
} = require("../controllers/portfolioController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Multer setup for multiple field uploads
const portfolioUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// ---------- Admin-only listing (before :slugOrId) ----------
router.get("/admin/all", requireAuth, requireAdmin, getAllPortfoliosAdmin);

// ---------- Public ----------
router.get("/", getAllPortfolios);
router.get("/:slugOrId", getPortfolio);

// ---------- Protected CRUD ----------
router.post("/", requireAuth, requireAdmin, portfolioUpload, createPortfolio);
router.put("/:id", requireAuth, requireAdmin, portfolioUpload, updatePortfolio);
router.patch("/:id/toggle", requireAuth, requireAdmin, togglePortfolioStatus);
router.patch("/:id/featured", requireAuth, requireAdmin, togglePortfolioFeatured);
router.delete("/:id", requireAuth, requireAdmin, deletePortfolio);

module.exports = router;