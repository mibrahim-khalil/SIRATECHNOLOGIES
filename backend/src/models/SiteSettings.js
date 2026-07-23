const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    // Company
    siteName: {
      type: String,
      default: "SIRA Technologies",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Build. Scale. Automate.",
      trim: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    logo: {
      url: String,
      public_id: String,
    },
    favicon: {
      url: String,
      public_id: String,
    },

    // Contact
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    responseTime: {
      type: String,
      default: "24-48 hours",
    },

    // Social Links
    social: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // SEO / Meta
    seo: {
      metaTitle: { type: String, default: "SIRA Technologies • Build. Scale. Automate." },
      metaDescription: { type: String, default: "" },
      ogImage: {
        url: String,
        public_id: String,
      },
      keywords: [String],
    },

    // Footer
    footerText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Force singleton: only 1 document allowed
siteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);