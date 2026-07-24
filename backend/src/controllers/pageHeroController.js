const PageHero = require("../models/PageHero");
const { cloudinary } = require("../config/cloudinary");
const { uploadBufferToCloudinary } = require("../middleware/uploadMiddleware");
const { success, error } = require("../utils/apiResponse");

async function deleteFromCloudinary(public_id) {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
}

/**
 * @desc    Get all page heroes (map keyed by page name)
 * @route   GET /api/heroes
 * @access  Public
 */
exports.getAll = async (req, res) => {
  try {
    const heroes = await PageHero.find();
    const map = {};
    heroes.forEach((h) => (map[h.page] = h));
    return success(res, { heroes: map, list: heroes }, "Heroes fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get single page hero
 * @route   GET /api/heroes/:page
 * @access  Public
 */
exports.getOne = async (req, res) => {
  try {
    const hero = await PageHero.findOne({ page: req.params.page });
    return success(res, { hero }, "Hero fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Upsert (create or update) page hero
 * @route   PUT /api/heroes/:page
 * @access  Private (Admin)
 */
exports.upsert = async (req, res) => {
  try {
    const { page } = req.params;
    const validPages = [
      "home", "about", "services", "portfolio",
      "pricing", "contact", "help", "start-project",
    ];
    if (!validPages.includes(page)) {
      return error(res, "Invalid page", 400);
    }

    let hero = await PageHero.findOne({ page });
    const {
      title,
      subtitle,
      primaryCtaLabel,
      primaryCtaTo,
      secondaryCtaLabel,
      secondaryCtaTo,
    } = req.body;

    if (!hero) {
      hero = new PageHero({ page });
    }

    if (title !== undefined) hero.title = title;
    if (subtitle !== undefined) hero.subtitle = subtitle;
    if (primaryCtaLabel !== undefined) hero.primaryCtaLabel = primaryCtaLabel;
    if (primaryCtaTo !== undefined) hero.primaryCtaTo = primaryCtaTo;
    if (secondaryCtaLabel !== undefined) hero.secondaryCtaLabel = secondaryCtaLabel;
    if (secondaryCtaTo !== undefined) hero.secondaryCtaTo = secondaryCtaTo;

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      if (hero.image?.public_id) await deleteFromCloudinary(hero.image.public_id);
      hero.image = uploaded;
    }

    await hero.save();
    return success(res, { hero }, "Hero saved");
  } catch (err) {
    console.error("upsert hero error:", err);
    return error(res, err.message);
  }
};

/**
 * @desc    Remove hero image
 * @route   DELETE /api/heroes/:page/image
 */
exports.removeImage = async (req, res) => {
  try {
    const hero = await PageHero.findOne({ page: req.params.page });
    if (!hero) return error(res, "Hero not found", 404);
    if (hero.image?.public_id) await deleteFromCloudinary(hero.image.public_id);
    hero.image = undefined;
    await hero.save();
    return success(res, { hero }, "Image removed");
  } catch (err) {
    return error(res, err.message);
  }
};