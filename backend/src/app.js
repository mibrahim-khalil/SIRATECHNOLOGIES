const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const siteSettingsRoutes = require("./routes/siteSettingsRoutes");

// Routes
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();

// ---------- CORS (simple + permissive for dev) ----------
app.use(
  cors({
    origin: true, // allow all origins in dev
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicit preflight handler
app.options("*", cors());

// ---------- Body parsers ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SiraTechnologies API is running 🚀",
    version: "1.0.0",
  });
});

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", siteSettingsRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;