const Review = require("../models/Review");
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
 * PUBLIC: Submit a review (goes to pending)
 */
exports.submitReview = async (req, res) => {
  try {
    const { name, role, company, email, rating, message, projectType } = req.body;

    if (!name || !rating || !message) {
      return error(res, "Name, rating and message are required", 400);
    }

    const data = {
      name,
      role: role || "",
      company: company || "",
      email: email || "",
      rating: Number(rating),
      message,
      projectType: projectType || "",
      source: "public",
      status: "pending", // needs approval
      isActive: false, // hidden until approved
    };

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      data.avatar = uploaded;
    }

    const review = await Review.create(data);
    return success(
      res,
      { review },
      "Thank you! Your review has been submitted for approval.",
      201
    );
  } catch (err) {
    console.error("submitReview error:", err);
    return error(res, err.message);
  }
};

/**
 * ADMIN: Create review directly (auto-approved)
 */
exports.createReview = async (req, res) => {
  try {
    const {
      name,
      role,
      company,
      email,
      rating,
      message,
      projectType,
      isFeatured,
      order,
      isActive,
    } = req.body;

    if (!name || !rating || !message) {
      return error(res, "Name, rating and message are required", 400);
    }

    const data = {
      name,
      role: role || "",
      company: company || "",
      email: email || "",
      rating: Number(rating),
      message,
      projectType: projectType || "",
      isFeatured: isFeatured === "true" || isFeatured === true,
      order: order || 0,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
      source: "admin",
      status: "approved",
    };

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      data.avatar = uploaded;
    }

    const review = await Review.create(data);
    return success(res, { review }, "Review created", 201);
  } catch (err) {
    console.error("createReview error:", err);
    return error(res, err.message);
  }
};

/**
 * PUBLIC: Get approved active reviews
 */
exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      isActive: true,
      status: "approved",
    }).sort({ isFeatured: -1, order: 1, createdAt: -1 });
    return success(res, { reviews, count: reviews.length }, "Reviews fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * ADMIN: Get all reviews (with optional status filter)
 */
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;

    const reviews = await Review.find(filter).sort({
      status: 1, // pending first
      createdAt: -1,
    });
    return success(res, { reviews, count: reviews.length }, "Reviews fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);
    return success(res, { review }, "Review fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);

    const fields = [
      "name",
      "role",
      "company",
      "email",
      "rating",
      "message",
      "projectType",
      "status",
      "order",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) review[f] = req.body[f];
    });

    if (req.body.isFeatured !== undefined) {
      review.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
    }
    if (req.body.isActive !== undefined) {
      review.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      if (review.avatar?.public_id) {
        await deleteFromCloudinary(review.avatar.public_id);
      }
      review.avatar = uploaded;
    }

    await review.save();
    return success(res, { review }, "Review updated");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);

    review.status = "approved";
    review.isActive = true;
    await review.save();

    return success(res, { review }, "Review approved & published");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);

    review.status = "rejected";
    review.isActive = false;
    await review.save();

    return success(res, { review }, "Review rejected");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);

    if (review.avatar?.public_id) {
      await deleteFromCloudinary(review.avatar.public_id);
    }

    await review.deleteOne();
    return success(res, {}, "Review deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.toggleReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);

    review.isActive = !review.isActive;
    await review.save();

    return success(
      res,
      { review },
      `Review ${review.isActive ? "activated" : "deactivated"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);

    review.isFeatured = !review.isFeatured;
    await review.save();

    return success(
      res,
      { review },
      `Review ${review.isFeatured ? "featured" : "unfeatured"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getPendingCount = async (req, res) => {
  try {
    const count = await Review.countDocuments({ status: "pending" });
    return success(res, { count }, "Pending count fetched");
  } catch (err) {
    return error(res, err.message);
  }
};