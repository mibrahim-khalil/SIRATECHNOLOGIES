const mongoose = require("mongoose");

const processStepSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true }, // "01"
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProcessStep", processStepSchema);