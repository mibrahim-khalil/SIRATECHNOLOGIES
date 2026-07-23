const express = require("express");
const router = express.Router();

const {
  createService,
  getAllServices,
  getAllServicesAdmin,
  getService,
  updateService,
  deleteService,
  toggleServiceStatus,
  reorderServices,
} = require("../controllers/serviceController");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ---------- Admin Routes ---------- (must be BEFORE :slugOrId)
router.get("/admin/all", requireAuth, requireAdmin, getAllServicesAdmin);
router.put("/reorder", requireAuth, requireAdmin, reorderServices);

// ---------- Public Routes ----------
router.get("/", getAllServices);
router.get("/:slugOrId", getService);

// ---------- Protected CRUD ----------
router.post("/", requireAuth, requireAdmin, upload.single("image"), createService);
router.put("/:id", requireAuth, requireAdmin, upload.single("image"), updateService);
router.patch("/:id/toggle", requireAuth, requireAdmin, toggleServiceStatus);
router.delete("/:id", requireAuth, requireAdmin, deleteService);

module.exports = router;