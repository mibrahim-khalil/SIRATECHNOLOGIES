const AboutContent = require("../models/AboutContent");
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

exports.getAbout = async (req, res) => {
  try {
    const about = await AboutContent.getSingleton();
    return success(res, { about }, "About content fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const about = await AboutContent.getSingleton();

    const textFields = [
      "heading",
      "subheading",
      "storyTitle",
      "storyContent",
      "mission",
      "vision",
      "teamSectionTitle",
      "teamSectionSubtitle",
      "ctaTitle",
      "ctaSubtitle",
      "ctaButtonText",
      "ctaButtonLink",
    ];
    textFields.forEach((f) => {
      if (req.body[f] !== undefined) about[f] = req.body[f];
    });

    // Parse arrays
    if (req.body.stats !== undefined) {
      try {
        about.stats =
          typeof req.body.stats === "string"
            ? JSON.parse(req.body.stats)
            : req.body.stats;
      } catch {
        about.stats = [];
      }
    }

    if (req.body.values !== undefined) {
      try {
        about.values =
          typeof req.body.values === "string"
            ? JSON.parse(req.body.values)
            : req.body.values;
      } catch {
        about.values = [];
      }
    }

    // Story image upload
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      if (about.storyImage?.public_id) {
        await deleteFromCloudinary(about.storyImage.public_id);
      }
      about.storyImage = uploaded;
    }

    await about.save();
    return success(res, { about }, "About content updated");
  } catch (err) {
    console.error("updateAbout error:", err);
    return error(res, err.message);
  }
};

exports.removeStoryImage = async (req, res) => {
  try {
    const about = await AboutContent.getSingleton();

    if (about.storyImage?.public_id) {
      await deleteFromCloudinary(about.storyImage.public_id);
    }

    about.storyImage = { url: undefined, public_id: undefined };
    await about.save();

    return success(res, { about }, "Story image removed");
  } catch (err) {
    return error(res, err.message);
  }
};