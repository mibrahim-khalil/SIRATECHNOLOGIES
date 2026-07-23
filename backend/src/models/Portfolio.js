const mongoose = require("mongoose");
const slugify = require("slugify");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Web", "Mobile", "UI/UX", "Branding", "SEO", "Other"],
      default: "Web",
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    gallery: [
      {
        url: String,
        public_id: String,
      },
    ],
    techStack: [String], // e.g. ["React", "Node.js"]
    liveUrl: String,
    githubUrl: String,
    client: String,
    completedAt: Date,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

portfolioSchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Portfolio", portfolioSchema);