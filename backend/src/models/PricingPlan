const mongoose = require("mongoose");

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },

    // Pricing
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "PKR", "EUR", "GBP", "AED"],
    },
    monthlyPrice: {
      type: Number,
      default: 0,
    },
    yearlyPrice: {
      type: Number,
      default: 0,
    },
    isCustomPricing: {
      type: Boolean,
      default: false, // For "Contact Us" plans
    },
    customPriceLabel: {
      type: String,
      default: "Custom", // Shown when isCustomPricing = true
    },

    // Features
    features: [
      {
        text: { type: String, required: true },
        included: { type: Boolean, default: true }, // ✓ or ✗
      },
    ],

    // CTA
    ctaText: {
      type: String,
      default: "Get Started",
    },
    ctaLink: {
      type: String,
      default: "/contact",
    },

    // Display
    badge: {
      type: String,
      default: "", // e.g. "MOST POPULAR", "BEST VALUE"
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    accentColor: {
      type: String,
      default: "#123A5A",
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

module.exports = mongoose.model("PricingPlan", pricingPlanSchema);