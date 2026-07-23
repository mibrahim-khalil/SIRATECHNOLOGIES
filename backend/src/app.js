const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// ---------- Global Middleware ----------
const allowedOrigins = [
  process.env.CLIENT_PUBLIC_URL,
  process.env.CLIENT_ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server-to-server (no origin)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
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

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;