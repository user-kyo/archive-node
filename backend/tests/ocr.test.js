const { cleanOcrText } = require('../nlp/ocrCleaner');

console.log("=== Testing OCR Text Cleaner ===");

const rawDirtyOcr = `
--- CHAPTER 5: PHOTOSYNTHESIS ---
=================================
§©® Plant ce11s use 0xygen and gluc0se in sunllght.
photo-
synthesis converts light into chemical energy...
*~#|:;.,
`;

const cleaned = cleanOcrText(rawDirtyOcr);
console.log("Input:", rawDirtyOcr);
console.log("Cleaned Output:\n" + cleaned);

let passed = true;
if (cleaned.includes('---') || cleaned.includes('===') || cleaned.includes('§©®')) {
  console.error("FAIL: Cleaner did not remove border and clutter symbols!");
  passed = false;
}
if (!cleaned.includes('cells') || !cleaned.includes('Oxygen') || !cleaned.includes('glucose') || !cleaned.includes('sunlight')) {
  console.error("FAIL: OCR character substitutions were not corrected!");
  passed = false;
}
if (!cleaned.includes('photosynthesis')) {
  console.error("FAIL: Hyphenated line break was not reassembled!");
  passed = false;
}

if (passed) {
  console.log("\n>>> OCR CLEANER TEST PASSED! <<<");
} else {
  console.error("\n>>> OCR CLEANER TEST FAILED! <<<");
  process.exit(1);
}
