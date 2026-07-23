const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    service: {
      type: String, // service they're interested in
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);