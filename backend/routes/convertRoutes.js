/**
 * convertRoutes.js
 * Defines the API routes for the Temperature Converter.
 *
 * Base path: /api  (mounted in server.js)
 * POST /api/convert  →  convertTemperature controller
 */

const express = require("express");
const router = express.Router();
const { convertTemperature } = require("../controllers/convertController");

// POST /api/convert — main conversion endpoint
router.post("/convert", convertTemperature);

// GET /api/convert — friendly hint for browser visitors
router.get("/convert", (req, res) => {
  res.json({
    message: "Temperature Converter API",
    usage: "Send a POST request with { value, fromUnit, toUnit }",
    example: { value: 100, fromUnit: "C", toUnit: "F" },
    units: { C: "Celsius", F: "Fahrenheit", K: "Kelvin" },
  });
});

module.exports = router;
