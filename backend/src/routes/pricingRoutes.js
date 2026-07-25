const express = require("express");
const router = express.Router();

const {
  createPlan,
  getAllPlans,
  getAllPlansAdmin,
  getPlan,
  updatePlan,
  deletePlan,
  togglePlan,
} = require("../controllers/pricingController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// Admin
router.get("/admin/all", requireAuth, requireAdmin, getAllPlansAdmin);

// Public
router.get("/", getAllPlans);
router.get("/:id", getPlan);

// Protected CRUD
router.post("/", requireAuth, requireAdmin, createPlan);
router.put("/:id", requireAuth, requireAdmin, updatePlan);
router.patch("/:id/toggle", requireAuth, requireAdmin, togglePlan);
router.delete("/:id", requireAuth, requireAdmin, deletePlan);

module.exports = router;