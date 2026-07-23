const Portfolio = require("../models/Portfolio");
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

async function deleteMultipleFromCloudinary(images = []) {
  await Promise.all(images.map((img) => deleteFromCloudinary(img.public_id)));
}

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
 * @desc    Create portfolio
 * @route   POST /api/portfolio
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
      client: clientName,
      completedAt,
      isFeatured,
      isActive,
      order,
    } = req.body;

    if (!title || !shortDescription || !description || !category) {
      return error(res, "Title, category, short description, description are required", 400);
    }

    if (!uploadedCover) {
      return error(res, "Cover image is required", 400);
    }

    // Upload cover
    console.log(`📤 Uploading cover: ${uploadedCover.originalname}`);
    const coverUploaded = await uploadBufferToCloudinary(
      uploadedCover.buffer,
      uploadedCover.originalname
    );
    console.log(`✅ Cover uploaded: ${coverUploaded.url}`);

    // Upload gallery sequentially (safer than parallel for large batches)
    const galleryUploaded = [];
    for (const file of uploadedGallery) {
      console.log(`📤 Uploading gallery: ${file.originalname}`);
      const uploaded = await uploadBufferToCloudinary(file.buffer, file.originalname);
      galleryUploaded.push(uploaded);
    }
    if (galleryUploaded.length) console.log(`✅ Gallery uploaded (${galleryUploaded.length} images)`);

    const portfolioData = {
      title,
      category,
      shortDescription,
      description,
      techStack: parseArrayField(techStack),
      liveUrl,
      githubUrl,
      client: clientName,
      completedAt: completedAt || undefined,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
      order: order ? Number(order) : 0,
      coverImage: coverUploaded,
      gallery: galleryUploaded,
    };

    const portfolio = await Portfolio.create(portfolioData);
    return success(res, { portfolio }, "Portfolio created successfully", 201);
  } catch (err) {
    console.error("createPortfolio error:", err);
    if (err.code === 11000) {
      return error(res, "A project with this title/slug already exists", 400);
    }
    return error(res, err.message);
  }
};

/**
 * @desc    Get all active portfolios (Public)
 */
exports.getAllPortfolios = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.isFeatured = true;

    const portfolios = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    return success(res, { portfolios, count: portfolios.length }, "Portfolios fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get all portfolios (Admin)
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
 * @desc    Get single portfolio
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
 */
exports.updatePortfolio = async (req, res) => {
  const uploadedCover = req.files?.coverImage?.[0];
  const uploadedGallery = req.files?.gallery || [];

  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return error(res, "Portfolio not found", 404);

    const {
      title,
      category,
      shortDescription,
      description,
      techStack,
      liveUrl,
      githubUrl,
      client: clientName,
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
    if (clientName !== undefined) portfolio.client = clientName;
    if (completedAt !== undefined) portfolio.completedAt = completedAt || undefined;
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

    // Replace cover
    if (uploadedCover) {
      console.log(`📤 Uploading new cover: ${uploadedCover.originalname}`);
      const coverUploaded = await uploadBufferToCloudinary(
        uploadedCover.buffer,
        uploadedCover.originalname
      );

      if (portfolio.coverImage?.public_id) {
        await deleteFromCloudinary(portfolio.coverImage.public_id);
      }
      portfolio.coverImage = coverUploaded;
    }

    // Remove selected gallery images
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

    // Add new gallery images
    if (uploadedGallery.length > 0) {
      for (const file of uploadedGallery) {
        console.log(`📤 Uploading new gallery: ${file.originalname}`);
        const uploaded = await uploadBufferToCloudinary(file.buffer, file.originalname);
        portfolio.gallery.push(uploaded);
      }
    }

    await portfolio.save();
    return success(res, { portfolio }, "Portfolio updated successfully");
  } catch (err) {
    console.error("updatePortfolio error:", err);
    return error(res, err.message);
  }
};

/**
 * @desc    Delete portfolio
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return error(res, "Portfolio not found", 404);

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
 * @desc    Toggle active
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
 * @desc    Toggle featured
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