const PopularBuild = require("../models/PopularBuild");
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

exports.getAll = async (req, res) => {
  try {
    const items = await PopularBuild.find().sort({ order: 1, createdAt: -1 });
    return success(res, { items, count: items.length }, "Popular builds fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getActive = async (req, res) => {
  try {
    const items = await PopularBuild.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    return success(res, { items, count: items.length }, "Popular builds fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, order, isActive } = req.body;
    if (!title || !description) {
      return error(res, "Title and description are required", 400);
    }

    const data = { title, description, order: order || 0, isActive: isActive !== "false" };

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      data.image = uploaded;
    }

    const item = await PopularBuild.create(data);
    return success(res, { item }, "Popular build created", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const item = await PopularBuild.findById(req.params.id);
    if (!item) return error(res, "Popular build not found", 404);

    const { title, description, order, isActive } = req.body;
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (order !== undefined) item.order = Number(order);
    if (isActive !== undefined) item.isActive = isActive === "true" || isActive === true;

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      if (item.image?.public_id) await deleteFromCloudinary(item.image.public_id);
      item.image = uploaded;
    }

    await item.save();
    return success(res, { item }, "Popular build updated");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await PopularBuild.findById(req.params.id);
    if (!item) return error(res, "Popular build not found", 404);
    if (item.image?.public_id) await deleteFromCloudinary(item.image.public_id);
    await item.deleteOne();
    return success(res, {}, "Popular build deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.toggle = async (req, res) => {
  try {
    const item = await PopularBuild.findById(req.params.id);
    if (!item) return error(res, "Popular build not found", 404);
    item.isActive = !item.isActive;
    await item.save();
    return success(res, { item }, `${item.isActive ? "Activated" : "Deactivated"}`);
  } catch (err) {
    return error(res, err.message);
  }
};