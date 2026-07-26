require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { connectCloudinary } = require("./config/cloudinary");
const seedAdmin = require("./utils/seedAdmin");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    connectCloudinary();

    // Auto-seed admin user on startup (safe — only creates if missing)
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});