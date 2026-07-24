const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/faqController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", ctrl.getActive); // public
router.get("/admin/all", requireAuth, requireAdmin, ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", requireAuth, requireAdmin, ctrl.create);
router.put("/:id", requireAuth, requireAdmin, ctrl.update);
router.patch("/:id/toggle", requireAuth, requireAdmin, ctrl.toggle);
router.delete("/:id", requireAuth, requireAdmin, ctrl.remove);

module.exports = router;