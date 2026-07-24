const mongoose = require("mongoose");

const addonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true }, // "$49+"
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Addon", addonSchema);