const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { success, error } = require("../utils/apiResponse");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }

    // include password (select:false in model)
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
 * @access  Private
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
 * @access  Private
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
 * @access  Private
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

    user.password = newPassword; // will be hashed by pre-save hook
    await user.save();

    return success(res, {}, "Password changed successfully");
  } catch (err) {
    return error(res, err.message);
  }
};