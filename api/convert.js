export default function handler(req, res) {
  const { value, from, to } = req.query;

  const temp = parseFloat(value);
  let result;

  if (from === "C" && to === "F") {
    result = (temp * 9) / 5 + 32;
  } else if (from === "F" && to === "C") {
    result = ((temp - 32) * 5) / 9;
  } else {
    result = temp;
  }

  res.status(200).json({ result });
}