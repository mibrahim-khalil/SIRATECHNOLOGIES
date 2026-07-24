const mongoose = require("mongoose");

const pageHeroSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "services", "portfolio", "pricing", "contact", "help", "start-project"],
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    image: {
      url: String,
      public_id: String,
    },
    primaryCtaLabel: { type: String, default: "" },
    primaryCtaTo: { type: String, default: "" },
    secondaryCtaLabel: { type: String, default: "" },
    secondaryCtaTo: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageHero", pageHeroSchema);