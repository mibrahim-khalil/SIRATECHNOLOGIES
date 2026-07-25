const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: [true, "Review message is required"],
      maxlength: 1000,
    },
    avatar: {
      url: String,
      public_id: String,
    },
    projectType: {
      type: String,
      default: "", // e.g. "Web Development", "Mobile App"
    },

    // Moderation
    source: {
      type: String,
      enum: ["admin", "public"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // admin adds default approved; public submits pending
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);