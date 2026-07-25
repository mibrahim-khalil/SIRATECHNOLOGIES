const TeamMember = require("../models/TeamMember");
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

exports.createMember = async (req, res) => {
  try {
    const { name, role, bio, email, social, order, isActive } = req.body;

    if (!name || !role) {
      return error(res, "Name and role are required", 400);
    }

    const data = {
      name,
      role,
      bio: bio || "",
      email: email || "",
      order: order || 0,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
    };

    if (social) {
      try {
        data.social = typeof social === "string" ? JSON.parse(social) : social;
      } catch {
        data.social = {};
      }
    }

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      data.photo = uploaded;
    }

    const member = await TeamMember.create(data);
    return success(res, { member }, "Team member created", 201);
  } catch (err) {
    console.error("createMember error:", err);
    return error(res, err.message);
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    return success(res, { members, count: members.length }, "Team fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getAllMembersAdmin = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    return success(res, { members, count: members.length }, "Team fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return error(res, "Team member not found", 404);
    return success(res, { member }, "Team member fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return error(res, "Team member not found", 404);

    const { name, role, bio, email, social, order, isActive } = req.body;

    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (bio !== undefined) member.bio = bio;
    if (email !== undefined) member.email = email;
    if (order !== undefined) member.order = order;
    if (isActive !== undefined) member.isActive = isActive === "true" || isActive === true;

    if (social !== undefined) {
      try {
        member.social = typeof social === "string" ? JSON.parse(social) : social;
      } catch {
        // ignore
      }
    }

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      if (member.photo?.public_id) {
        await deleteFromCloudinary(member.photo.public_id);
      }
      member.photo = uploaded;
    }

    await member.save();
    return success(res, { member }, "Team member updated");
  } catch (err) {
    console.error("updateMember error:", err);
    return error(res, err.message);
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return error(res, "Team member not found", 404);

    if (member.photo?.public_id) {
      await deleteFromCloudinary(member.photo.public_id);
    }

    await member.deleteOne();
    return success(res, {}, "Team member deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.toggleMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return error(res, "Team member not found", 404);

    member.isActive = !member.isActive;
    await member.save();

    return success(
      res,
      { member },
      `Member ${member.isActive ? "activated" : "deactivated"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};