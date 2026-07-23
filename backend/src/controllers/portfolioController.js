const Portfolio = require("../models/Portfolio");
const { cloudinary } = require("../config/cloudinary");
const { success, error } = require("../utils/apiResponse");

/**
 * Helper: delete image from Cloudinary
 */
async function deleteFromCloudinary(public_id) {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
}

/**
 * Helper: delete multiple images
 */
async function deleteMultipleFromCloudinary(images = []) {
  await Promise.all(images.map((img) => deleteFromCloudinary(img.public_id)));
}

/**
 * Helper: parse array-ish input (JSON string / comma string / array)
 */
function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
}

/**
 * @desc    Create new portfolio project
 * @route   POST /api/portfolio
 * @access  Private (Admin)
 *
 * Files expected via multer:
 *   - coverImage (single)
 *   - gallery (multiple, up to 10)
 */
exports.createPortfolio = async (req, res) => {
  const uploadedCover = req.files?.coverImage?.[0];
  const uploadedGallery = req.files?.gallery || [];

  try {
    const {
      title,
      category,
      shortDescription,
      description,
      techStack,
      liveUrl,
      githubUrl,
      client,
      completedAt,
      isFeatured,
      isActive,
      order,
    } = req.body;

    if (!title || !shortDescription || !description || !category) {
      // cleanup uploaded files if validation fails
      if (uploadedCover) await deleteFromCloudinary(uploadedCover.filename);
      await deleteMultipleFromCloudinary(
        uploadedGallery.map((f) => ({ public_id: f.filename }))
      );
      return error(res, "Title, category, short description, description are required", 400);
    }

    if (!uploadedCover) {
      return error(res, "Cover image is required", 400);
    }

    const portfolioData = {
      title,
      category,
      shortDescription,
      description,
      techStack: parseArrayField(techStack),
      liveUrl,
      githubUrl,
      client,
      completedAt: completedAt || undefined,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
      order: order ? Number(order) : 0,
      coverImage: {
        url: uploadedCover.path,
        public_id: uploadedCover.filename,
      },
      gallery: uploadedGallery.map((f) => ({
        url: f.path,
        public_id: f.filename,
      })),
    };

    const portfolio = await Portfolio.create(portfolioData);

    return success(res, { portfolio }, "Portfolio created successfully", 201);
  } catch (err) {
    // cleanup on failure
    if (uploadedCover) await deleteFromCloudinary(uploadedCover.filename);
    await deleteMultipleFromCloudinary(
      uploadedGallery.map((f) => ({ public_id: f.filename }))
    );

    if (err.code === 11000) {
      return error(res, "A project with this title/slug already exists", 400);
    }
    return error(res, err.message);
  }
};

/**
 * @desc    Get all active portfolios (Public)
 * @route   GET /api/portfolio
 * @access  Public
 * @query   ?category=Web  &featured=true
 */
exports.getAllPortfolios = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.isFeatured = true;

    const portfolios = await Portfolio.find(filter).sort({
      order: 1,
      createdAt: -1,
    });

    return success(
      res,
      { portfolios, count: portfolios.length },
      "Portfolios fetched"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get all portfolios incl. inactive (Admin)
 * @route   GET /api/portfolio/admin/all
 * @access  Private (Admin)
 */
exports.getAllPortfoliosAdmin = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ order: 1, createdAt: -1 });
    return success(res, { portfolios, count: portfolios.length }, "Portfolios fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get single portfolio by slug/id
 * @route   GET /api/portfolio/:slugOrId
 * @access  Public
 */
exports.getPortfolio = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isValidId = slugOrId.match(/^[0-9a-fA-F]{24}$/);

    const portfolio = isValidId
      ? await Portfolio.findById(slugOrId)
      : await Portfolio.findOne({ slug: slugOrId });

    if (!portfolio) return error(res, "Portfolio not found", 404);

    return success(res, { portfolio }, "Portfolio fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Update portfolio
 * @route   PUT /api/portfolio/:id
 * @access  Private (Admin)
 *
 * Optional files:
 *   - coverImage (replaces existing cover)
 *   - gallery (ADDS to existing gallery)
 *
 * Body option:
 *   - removeGalleryIds: JSON array of public_ids to remove from gallery
 */
exports.updatePortfolio = async (req, res) => {
  const uploadedCover = req.files?.coverImage?.[0];
  const uploadedGallery = req.files?.gallery || [];

  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      if (uploadedCover) await deleteFromCloudinary(uploadedCover.filename);
      await deleteMultipleFromCloudinary(
        uploadedGallery.map((f) => ({ public_id: f.filename }))
      );
      return error(res, "Portfolio not found", 404);
    }

    const {
      title,
      category,
      shortDescription,
      description,
      techStack,
      liveUrl,
      githubUrl,
      client,
      completedAt,
      isFeatured,
      isActive,
      order,
      removeGalleryIds,
    } = req.body;

    if (title !== undefined) portfolio.title = title;
    if (category !== undefined) portfolio.category = category;
    if (shortDescription !== undefined) portfolio.shortDescription = shortDescription;
    if (description !== undefined) portfolio.description = description;
    if (liveUrl !== undefined) portfolio.liveUrl = liveUrl;
    if (githubUrl !== undefined) portfolio.githubUrl = githubUrl;
    if (client !== undefined) portfolio.client = client;
    if (completedAt !== undefined) portfolio.completedAt = completedAt;
    if (order !== undefined) portfolio.order = Number(order);

    if (isFeatured !== undefined) {
      portfolio.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    if (isActive !== undefined) {
      portfolio.isActive = isActive === "true" || isActive === true;
    }
    if (techStack !== undefined) {
      portfolio.techStack = parseArrayField(techStack);
    }

    // replace cover image
    if (uploadedCover) {
      if (portfolio.coverImage?.public_id) {
        await deleteFromCloudinary(portfolio.coverImage.public_id);
      }
      portfolio.coverImage = {
        url: uploadedCover.path,
        public_id: uploadedCover.filename,
      };
    }

    // remove selected gallery images
    if (removeGalleryIds) {
      const toRemove = parseArrayField(removeGalleryIds);
      if (toRemove.length > 0) {
        const toDelete = portfolio.gallery.filter((img) =>
          toRemove.includes(img.public_id)
        );
        await deleteMultipleFromCloudinary(toDelete);
        portfolio.gallery = portfolio.gallery.filter(
          (img) => !toRemove.includes(img.public_id)
        );
      }
    }

    // add new gallery images
    if (uploadedGallery.length > 0) {
      const newImages = uploadedGallery.map((f) => ({
        url: f.path,
        public_id: f.filename,
      }));
      portfolio.gallery.push(...newImages);
    }

    await portfolio.save();

    return success(res, { portfolio }, "Portfolio updated successfully");
  } catch (err) {
    if (uploadedCover) await deleteFromCloudinary(uploadedCover.filename);
    await deleteMultipleFromCloudinary(
      uploadedGallery.map((f) => ({ public_id: f.filename }))
    );
    return error(res, err.message);
  }
};

/**
 * @desc    Delete portfolio
 * @route   DELETE /api/portfolio/:id
 * @access  Private (Admin)
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return error(res, "Portfolio not found", 404);

    // delete all cloudinary images
    if (portfolio.coverImage?.public_id) {
      await deleteFromCloudinary(portfolio.coverImage.public_id);
    }
    await deleteMultipleFromCloudinary(portfolio.gallery);

    await portfolio.deleteOne();

    return success(res, {}, "Portfolio deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Toggle active status
 * @route   PATCH /api/portfolio/:id/toggle
 * @access  Private (Admin)
 */
exports.togglePortfolioStatus = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return error(res, "Portfolio not found", 404);

    portfolio.isActive = !portfolio.isActive;
    await portfolio.save();

    return success(
      res,
      { portfolio },
      `Portfolio ${portfolio.isActive ? "activated" : "deactivated"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Toggle featured status
 * @route   PATCH /api/portfolio/:id/featured
 * @access  Private (Admin)
 */
exports.togglePortfolioFeatured = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return error(res, "Portfolio not found", 404);

    portfolio.isFeatured = !portfolio.isFeatured;
    await portfolio.save();

    return success(
      res,
      { portfolio },
      `Portfolio ${portfolio.isFeatured ? "marked featured" : "unfeatured"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};