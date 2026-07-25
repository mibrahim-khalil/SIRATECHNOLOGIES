const mongoose = require("mongoose");

const aboutContentSchema = new mongoose.Schema(
  {
    // Hero / intro
    heading: {
      type: String,
      default: "About SIRA Technologies",
    },
    subheading: {
      type: String,
      default: "Building the future, one line of code at a time",
    },

    // Story
    storyTitle: {
      type: String,
      default: "Our Story",
    },
    storyContent: {
      type: String,
      default: "",
    },
    storyImage: {
      url: String,
      public_id: String,
    },

    // Mission / Vision
    mission: {
      type: String,
      default: "",
    },
    vision: {
      type: String,
      default: "",
    },

    // Stats (e.g. "50+ Projects", "10+ Years")
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        icon: { type: String, default: "TrendingUp" }, // lucide icon name
      },
    ],

    // Core Values
    values: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "Heart" }, // lucide icon name
      },
    ],

    // Team section labels
    teamSectionTitle: {
      type: String,
      default: "Meet Our Team",
    },
    teamSectionSubtitle: {
      type: String,
      default: "The brilliant minds behind SIRA Technologies",
    },

    // CTA
    ctaTitle: {
      type: String,
      default: "Ready to work with us?",
    },
    ctaSubtitle: {
      type: String,
      default: "",
    },
    ctaButtonText: {
      type: String,
      default: "Get in touch",
    },
    ctaButtonLink: {
      type: String,
      default: "/contact",
    },
  },
  { timestamps: true }
);

// Singleton
aboutContentSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model("AboutContent", aboutContentSchema);