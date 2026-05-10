/**
 * Temperature Converter - Express.js Backend Server
 * Engineering Mini Project
 *
 * Entry point: sets up Express app, middleware, and routes.
 */

const express = require("express");
const cors = require("cors");
const convertRoutes = require("./routes/convertRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────
// Enable CORS so the frontend (different origin/port) can call this API
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve static frontend files from the /frontend directory
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

// ── Routes ─────────────────────────────────────────────────────────────────
// All /api/* requests are handled by convertRoutes
app.use("/api", convertRoutes);

// ── Root health-check ──────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Temperature Converter API is running 🌡️" });
});

// Catch-all: serve the frontend for any unmatched route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// ── Start server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌡️  Temperature Converter API`);
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   POST /api/convert  →  convert temperatures\n`);
});
