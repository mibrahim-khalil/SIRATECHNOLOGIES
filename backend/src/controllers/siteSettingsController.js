const SiteSettings = require("../models/SiteSettings");
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
 * @desc    Get site settings (public + admin use same endpoint)
 * @route   GET /api/settings
 * @access  Public
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSingleton();
    return success(res, { settings }, "Settings fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Update site settings
 * @route   PUT /api/settings
 * @access  Private (Admin)
 *
 * Files (optional):
 *   - logo    (single)
 *   - favicon (single)
 *   - ogImage (single)
 */
exports.updateSettings = async (req, res) => {
  const uploadedLogo = req.files?.logo?.[0];
  const uploadedFavicon = req.files?.favicon?.[0];
  const uploadedOgImage = req.files?.ogImage?.[0];

  try {
    const settings = await SiteSettings.getSingleton();

    const {
      siteName,
      tagline,
      shortDescription,
      email,
      phone,
      whatsapp,
      address,
      responseTime,
      social,
      seo,
      footerText,
    } = req.body;

    if (siteName !== undefined) settings.siteName = siteName;
    if (tagline !== undefined) settings.tagline = tagline;
    if (shortDescription !== undefined) settings.shortDescription = shortDescription;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (address !== undefined) settings.address = address;
    if (responseTime !== undefined) settings.responseTime = responseTime;
    if (footerText !== undefined) settings.footerText = footerText;

    // social object (comes as JSON string via multipart form)
    if (social !== undefined) {
      const parsed = typeof social === "string" ? JSON.parse(social) : social;
      settings.social = { ...settings.social.toObject?.() || settings.social, ...parsed };
    }

    // seo object (comes as JSON string)
    if (seo !== undefined) {
      const parsed = typeof seo === "string" ? JSON.parse(seo) : seo;
      settings.seo = {
        ...(settings.seo.toObject?.() || settings.seo),
        ...parsed,
      };
    }

    // Handle logo upload
    if (uploadedLogo) {
      console.log(`📤 Uploading logo`);
      const uploaded = await uploadBufferToCloudinary(
        uploadedLogo.buffer,
        uploadedLogo.originalname
      );
      if (settings.logo?.public_id) {
        await deleteFromCloudinary(settings.logo.public_id);
      }
      settings.logo = uploaded;
    }

    // Handle favicon upload
    if (uploadedFavicon) {
      console.log(`📤 Uploading favicon`);
      const uploaded = await uploadBufferToCloudinary(
        uploadedFavicon.buffer,
        uploadedFavicon.originalname
      );
      if (settings.favicon?.public_id) {
        await deleteFromCloudinary(settings.favicon.public_id);
      }
      settings.favicon = uploaded;
    }

    // Handle OG image upload
    if (uploadedOgImage) {
      console.log(`📤 Uploading OG image`);
      const uploaded = await uploadBufferToCloudinary(
        uploadedOgImage.buffer,
        uploadedOgImage.originalname
      );
      if (settings.seo.ogImage?.public_id) {
        await deleteFromCloudinary(settings.seo.ogImage.public_id);
      }
      settings.seo.ogImage = uploaded;
    }

    await settings.save();

    return success(res, { settings }, "Settings updated successfully");
  } catch (err) {
    console.error("updateSettings error:", err);
    return error(res, err.message);
  }
};

/**
 * @desc    Remove a specific image (logo/favicon/ogImage)
 * @route   DELETE /api/settings/image/:type
 * @access  Private (Admin)
 */
exports.removeImage = async (req, res) => {
  try {
    const { type } = req.params;
    const settings = await SiteSettings.getSingleton();

    if (type === "logo") {
      if (settings.logo?.public_id) await deleteFromCloudinary(settings.logo.public_id);
      settings.logo = undefined;
    } else if (type === "favicon") {
      if (settings.favicon?.public_id) await deleteFromCloudinary(settings.favicon.public_id);
      settings.favicon = undefined;
    } else if (type === "ogImage") {
      if (settings.seo?.ogImage?.public_id) {
        await deleteFromCloudinary(settings.seo.ogImage.public_id);
      }
      settings.seo.ogImage = undefined;
    } else {
      return error(res, "Invalid image type", 400);
    }

    await settings.save();
    return success(res, { settings }, "Image removed");
  } catch (err) {
    return error(res, err.message);
  }
};