const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/popularBuildController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", ctrl.getActive);
router.get("/admin/all", requireAuth, requireAdmin, ctrl.getAll);
router.post("/", requireAuth, requireAdmin, upload.single("image"), ctrl.create);
router.put("/:id", requireAuth, requireAdmin, upload.single("image"), ctrl.update);
router.patch("/:id/toggle", requireAuth, requireAdmin, ctrl.toggle);
router.delete("/:id", requireAuth, requireAdmin, ctrl.remove);

module.exports = router;