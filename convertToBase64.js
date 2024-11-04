const fs = require("fs");
const path = require("path");

const fontPath = path.resolve(
  __dirname,
  "assets/fonts/NotoNastaliqUrdu-Regular.ttf"
); // Update to your actual font path
const base64Font = fs.readFileSync(fontPath, "base64");
console.log(`data:font/ttf;base64,${base64Font}`);
