const Service = require("../models/Service");
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
 * @desc    Create new service
 * @route   POST /api/services
 */
exports.createService = async (req, res) => {
  try {
    const { title, shortDescription, description, icon, features, order, isActive } =
      req.body;

    if (!title || !shortDescription || !description) {
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

    if (features) {
      try {
        serviceData.features =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch {
        serviceData.features = features.split(",").map((f) => f.trim());
      }
    }

    // Upload image if provided
    if (req.file) {
      console.log(`📤 Uploading to Cloudinary: ${req.file.originalname} (${req.file.size} bytes)`);
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      console.log(`✅ Uploaded: ${uploaded.url}`);
      serviceData.image = uploaded;
    }

    const service = await Service.create(serviceData);
    return success(res, { service }, "Service created successfully", 201);
  } catch (err) {
    console.error("createService error:", err);
    if (err.code === 11000) {
      return error(res, "A service with this title/slug already exists", 400);
    }
    return error(res, err.message);
  }
};

/**
 * @desc    Get all active services (Public)
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
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return error(res, "Service not found", 404);

    const { title, shortDescription, description, icon, features, order, isActive } =
      req.body;

    if (title !== undefined) service.title = title;
    if (shortDescription !== undefined) service.shortDescription = shortDescription;
    if (description !== undefined) service.description = description;
    if (icon !== undefined) service.icon = icon;
    if (order !== undefined) service.order = order;
    if (isActive !== undefined) service.isActive = isActive === "true" || isActive === true;

    if (features !== undefined) {
      try {
        service.features =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch {
        service.features = features.split(",").map((f) => f.trim());
      }
    }

    // Replace image if new one uploaded
    if (req.file) {
      console.log(`📤 Uploading to Cloudinary: ${req.file.originalname}`);
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      if (service.image?.public_id) {
        await deleteFromCloudinary(service.image.public_id);
      }
      service.image = uploaded;
    }

    await service.save();
    return success(res, { service }, "Service updated successfully");
  } catch (err) {
    console.error("updateService error:", err);
    return error(res, err.message);
  }
};

/**
 * @desc    Delete service
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return error(res, "Service not found", 404);

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
 * @desc    Reorder services
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