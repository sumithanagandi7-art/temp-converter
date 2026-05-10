/**
 * convertController.js
 * Handles the core conversion logic and input validation.
 *
 * Supported units: Celsius (C), Fahrenheit (F), Kelvin (K)
 * All six directional conversions are implemented.
 */

// ── Conversion formulas ────────────────────────────────────────────────────
const CONVERSIONS = {
  C_TO_F: {
    convert: (v) => (v * 9) / 5 + 32,
    formula: (v) => `(${v} × 9/5) + 32`,
    label: "°C → °F",
  },
  C_TO_K: {
    convert: (v) => v + 273.15,
    formula: (v) => `${v} + 273.15`,
    label: "°C → K",
  },
  F_TO_C: {
    convert: (v) => ((v - 32) * 5) / 9,
    formula: (v) => `(${v} − 32) × 5/9`,
    label: "°F → °C",
  },
  F_TO_K: {
    convert: (v) => ((v - 32) * 5) / 9 + 273.15,
    formula: (v) => `((${v} − 32) × 5/9) + 273.15`,
    label: "°F → K",
  },
  K_TO_C: {
    convert: (v) => v - 273.15,
    formula: (v) => `${v} − 273.15`,
    label: "K → °C",
  },
  K_TO_F: {
    convert: (v) => ((v - 273.15) * 9) / 5 + 32,
    formula: (v) => `((${v} − 273.15) × 9/5) + 32`,
    label: "K → °F",
  },
};

// Absolute zero limits (in Celsius) to prevent physically impossible inputs
const ABSOLUTE_ZERO = {
  C: -273.15,
  F: -459.67,
  K: 0,
};

/**
 * POST /api/convert
 * Body: { value: number, fromUnit: "C"|"F"|"K", toUnit: "C"|"F"|"K" }
 * Returns conversion result with formula, original and converted values.
 */
const convertTemperature = (req, res) => {
  const { value, fromUnit, toUnit } = req.body;

  // ── 1. Presence validation ───────────────────────────────────────────────
  if (value === undefined || value === null || value === "") {
    return res.status(400).json({
      success: false,
      error: "Missing temperature value",
      message: "Please provide a numeric temperature value.",
    });
  }

  if (!fromUnit || !toUnit) {
    return res.status(400).json({
      success: false,
      error: "Missing unit(s)",
      message: "Both fromUnit and toUnit are required (C, F, or K).",
    });
  }

  // ── 2. Type validation ───────────────────────────────────────────────────
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return res.status(400).json({
      success: false,
      error: "Invalid temperature value",
      message: `"${value}" is not a valid number.`,
    });
  }

  // ── 3. Unit validation ───────────────────────────────────────────────────
  const validUnits = ["C", "F", "K"];
  const from = fromUnit.toUpperCase();
  const to = toUnit.toUpperCase();

  if (!validUnits.includes(from) || !validUnits.includes(to)) {
    return res.status(400).json({
      success: false,
      error: "Invalid unit",
      message: `Units must be one of: C (Celsius), F (Fahrenheit), K (Kelvin). Got: ${fromUnit}, ${toUnit}`,
    });
  }

  // ── 4. Physical impossibility check (below absolute zero) ────────────────
  if (numericValue < ABSOLUTE_ZERO[from]) {
    return res.status(400).json({
      success: false,
      error: "Below absolute zero",
      message: `${numericValue}°${from} is below absolute zero — physically impossible!`,
    });
  }

  // ── 5. Same-unit shortcut ────────────────────────────────────────────────
  if (from === to) {
    return res.json({
      success: true,
      original: { value: numericValue, unit: from },
      converted: { value: numericValue, unit: to },
      formula: `No conversion needed — same unit (${from})`,
      formulaLabel: `${from} → ${to}`,
    });
  }

  // ── 6. Perform conversion ────────────────────────────────────────────────
  const key = `${from}_TO_${to}`;
  const conversionDef = CONVERSIONS[key];

  if (!conversionDef) {
    return res.status(500).json({
      success: false,
      error: "Unsupported conversion",
      message: `Conversion from ${from} to ${to} is not implemented.`,
    });
  }

  const convertedValue = conversionDef.convert(numericValue);
  const formulaStr = conversionDef.formula(numericValue);

  // Round to 4 decimal places to avoid floating-point noise
  const rounded = Math.round(convertedValue * 10000) / 10000;

  // ── 7. Return structured response ────────────────────────────────────────
  return res.json({
    success: true,
    original: { value: numericValue, unit: from },
    converted: { value: rounded, unit: to },
    formula: formulaStr,
    formulaLabel: conversionDef.label,
  });
};

module.exports = { convertTemperature };
