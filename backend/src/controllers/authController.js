const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");
const { uploadBufferToCloudinary } = require("../middleware/uploadMiddleware");
const { success, error } = require("../utils/apiResponse");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

async function deleteFromCloudinary(public_id) {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
}

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) return error(res, "Invalid credentials", 401);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return error(res, "Invalid credentials", 401);

    const token = generateToken(user);

    return success(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Login successful"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, "User not found", 404);

    return success(res, { user }, "Profile fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Update logged-in user profile
 * @route   PUT /api/auth/me
 */
exports.updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return error(res, "User not found", 404);

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    await user.save();

    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Profile updated"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return error(res, "Both current and new password are required", 400);
    }
    if (newPassword.length < 6) {
      return error(res, "New password must be at least 6 characters", 400);
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return error(res, "User not found", 404);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return error(res, "Current password is incorrect", 401);

    user.password = newPassword;
    await user.save();

    return success(res, {}, "Password changed successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Upload / update avatar
 * @route   POST /api/auth/avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "No image file provided", 400);
    }

    const user = await User.findById(req.user.id);
    if (!user) return error(res, "User not found", 404);

    console.log(`📤 Uploading avatar: ${req.file.originalname}`);
    const uploaded = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname
    );
    console.log(`✅ Avatar uploaded: ${uploaded.url}`);

    // Remove old avatar from cloud
    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    user.avatar = uploaded;
    await user.save();

    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Avatar updated successfully"
    );
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return error(res, err.message);
  }
};

/**
 * @desc    Remove avatar
 * @route   DELETE /api/auth/avatar
 */
exports.removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, "User not found", 404);

    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    user.avatar = { url: undefined, public_id: undefined };
    await user.save();

    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      "Avatar removed"
    );
  } catch (err) {
    return error(res, err.message);
  }
};