const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  getLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
} = require("../controllers/contactController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// ---------- Public ----------
router.post("/", createLead); // public site form submits here

// ---------- Admin ----------
router.get("/stats/overview", requireAuth, requireAdmin, getLeadStats);
router.get("/", requireAuth, requireAdmin, getAllLeads);
router.get("/:id", requireAuth, requireAdmin, getLead);
router.patch("/:id/status", requireAuth, requireAdmin, updateLeadStatus);
router.delete("/:id", requireAuth, requireAdmin, deleteLead);

module.exports = router;