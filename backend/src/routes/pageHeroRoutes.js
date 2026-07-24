const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/pageHeroController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", ctrl.getAll);
router.get("/:page", ctrl.getOne);
router.put("/:page", requireAuth, requireAdmin, upload.single("image"), ctrl.upsert);
router.delete("/:page/image", requireAuth, requireAdmin, ctrl.removeImage);

module.exports = router;