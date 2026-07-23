const mongoose = require("mongoose");
const slugify = require("slugify");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: 250,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    icon: {
      type: String, // e.g. lucide icon name or emoji
      default: "Code",
    },
    image: {
      url: String,
      public_id: String,
    },
    features: [String], // bullet points
    order: {
      type: Number,
      default: 0, // for display sorting
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
serviceSchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Service", serviceSchema);