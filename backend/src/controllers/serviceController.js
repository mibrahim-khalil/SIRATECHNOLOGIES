const Service = require("../models/Service");
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
 * @desc    Create new service
 * @route   POST /api/services
 * @access  Private (Admin)
 */
exports.createService = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      icon,
      features,
      order,
      isActive,
    } = req.body;

    if (!title || !shortDescription || !description) {
      // if file uploaded but validation failed, remove from cloudinary
      if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
      return error(res, "Title, short description and description are required", 400);
    }

    const serviceData = {
      title,
      shortDescription,
      description,
      icon: icon || "Code",
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    };

    // features can arrive as JSON string or array
    if (features) {
      try {
        serviceData.features =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch {
        serviceData.features = features.split(",").map((f) => f.trim());
      }
    }

    // if image uploaded
    if (req.file) {
      serviceData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const service = await Service.create(serviceData);

    return success(res, { service }, "Service created successfully", 201);
  } catch (err) {
    if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
    if (err.code === 11000) {
      return error(res, "A service with this title/slug already exists", 400);
    }
    return error(res, err.message);
  }
};

/**
 * @desc    Get all active services (Public)
 * @route   GET /api/services
 * @access  Public
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    return success(res, { services, count: services.length }, "Services fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get all services incl. inactive (Admin)
 * @route   GET /api/services/admin/all
 * @access  Private (Admin)
 */
exports.getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    return success(res, { services, count: services.length }, "Services fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get single service by slug or id
 * @route   GET /api/services/:slugOrId
 * @access  Public
 */
exports.getService = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isValidId = slugOrId.match(/^[0-9a-fA-F]{24}$/);

    const service = isValidId
      ? await Service.findById(slugOrId)
      : await Service.findOne({ slug: slugOrId });

    if (!service) return error(res, "Service not found", 404);

    return success(res, { service }, "Service fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private (Admin)
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
      return error(res, "Service not found", 404);
    }

    const {
      title,
      shortDescription,
      description,
      icon,
      features,
      order,
      isActive,
    } = req.body;

    if (title !== undefined) service.title = title;
    if (shortDescription !== undefined) service.shortDescription = shortDescription;
    if (description !== undefined) service.description = description;
    if (icon !== undefined) service.icon = icon;
    if (order !== undefined) service.order = order;
    if (isActive !== undefined) service.isActive = isActive;

    if (features !== undefined) {
      try {
        service.features =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch {
        service.features = features.split(",").map((f) => f.trim());
      }
    }

    // new image uploaded → replace old one
    if (req.file) {
      if (service.image?.public_id) {
        await deleteFromCloudinary(service.image.public_id);
      }
      service.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await service.save();

    return success(res, { service }, "Service updated successfully");
  } catch (err) {
    if (req.file?.filename) await deleteFromCloudinary(req.file.filename);
    return error(res, err.message);
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private (Admin)
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return error(res, "Service not found", 404);

    // remove image from cloudinary
    if (service.image?.public_id) {
      await deleteFromCloudinary(service.image.public_id);
    }

    await service.deleteOne();

    return success(res, {}, "Service deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Toggle service active status
 * @route   PATCH /api/services/:id/toggle
 * @access  Private (Admin)
 */
exports.toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return error(res, "Service not found", 404);

    service.isActive = !service.isActive;
    await service.save();

    return success(
      res,
      { service },
      `Service ${service.isActive ? "activated" : "deactivated"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Reorder services (bulk)
 * @route   PUT /api/services/reorder
 * @access  Private (Admin)
 * @body    { items: [{ id, order }, ...] }
 */
exports.reorderServices = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return error(res, "items must be an array", 400);
    }

    await Promise.all(
      items.map((item) =>
        Service.findByIdAndUpdate(item.id, { order: item.order })
      )
    );

    return success(res, {}, "Services reordered successfully");
  } catch (err) {
    return error(res, err.message);
  }
};