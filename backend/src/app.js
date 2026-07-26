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
const faqRoutes = require("./routes/faqRoutes");
const addonRoutes = require("./routes/addonRoutes");
const processRoutes = require("./routes/processRoutes");
const popularBuildRoutes = require("./routes/popularBuildRoutes");
const pageHeroRoutes = require("./routes/pageHeroRoutes");

// PHASE 3 routes
const teamRoutes = require("./routes/teamRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const aboutRoutes = require("./routes/aboutRoutes");

const app = express();

// ---------- CORS ----------
// Build allow-list from env + local dev
const allowedOrigins = [
  "http://localhost:5173",           // vite public dev
  "http://localhost:5174",           // vite admin dev
  "http://localhost:3000",           // fallback
  process.env.FRONTEND_PUBLIC_URL,   // e.g. https://sira.vercel.app
  process.env.FRONTEND_ADMIN_URL,    // e.g. https://sira-admin.vercel.app
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow if in whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all *.vercel.app preview deploys (optional, useful during dev)
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS blocked: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ---------- Body parsers ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Only log in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("tiny"));
}

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SiraTechnologies API is running 🚀",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", siteSettingsRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/addons", addonRoutes);
app.use("/api/process", processRoutes);
app.use("/api/popular-builds", popularBuildRoutes);
app.use("/api/heroes", pageHeroRoutes);

// PHASE 3
app.use("/api/team", teamRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/about", aboutRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;