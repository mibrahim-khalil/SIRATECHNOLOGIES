const User = require("../models/User");

/**
 * Seed the initial admin user if none exists.
 * Safe to call on every server startup — will only create if missing.
 * 
 * Can also be run standalone via: `npm run seed:admin`
 */
async function seedAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn("⚠️  Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD not set");
      return;
    }

    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existing) {
      console.log(`👤 Admin exists: ${existing.email}`);
      return;
    }

    const admin = await User.create({
      name: ADMIN_NAME || "Super Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log("⚠️  Please change the password after first login!");
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
    // Don't crash the server on seed failure
  }
}

module.exports = seedAdmin;

// ---------- Standalone mode ----------
// If run directly (npm run seed:admin), connect and seed
if (require.main === module) {
  require("dotenv").config();
  const connectDB = require("../config/db");

  (async () => {
    try {
      await connectDB();
      await seedAdmin();
      process.exit(0);
    } catch (err) {
      console.error("❌ Standalone seed failed:", err.message);
      process.exit(1);
    }
  })();
}