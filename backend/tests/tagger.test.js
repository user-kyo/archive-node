// Contextual POS Tagger Unit Test & Verification
const { tagText, analyzeText } = require('../nlp/tagger');

const testCases = [
  {
    name: "Sample Note from System Background",
    text: "Photosynthesis is soooo important daw sa exam!! yung chlorophyll sa leaves absorbs sunlight, then plants make glucose. di ko maintindihan yung light reactions, ask Ma'am Reyes. couldn't finish the Calvin cycle notes. Photosynthesis = glucose + oxygen.",
    expected: {
      "photosynthesis": "NN",
      "important": "JJ",
      "exam": "NN",
      "chlorophyll": "NN",
      "leaves": "NNS",
      "absorbs": "VBZ",
      "sunlight": "NN",
      "plants": "NNS",
      "make": "VBP", // or VB
      "glucose": "NN",
      "light": "JJ",
      "reactions": "NNS",
      "ask": "VB",
      "reyes": "NNP",
      "finish": "VB",
      "calvin": "NNP",
      "cycle": "NN",
      "notes": "NNS",
      "oxygen": "NN"
    }
  },
  {
    name: "Scientific Study Actions & Modifiers",
    text: "Melvin Calvin studied the cycle thoroughly. Cellular respiration rapidly produces energy in mitochondria.",
    expected: {
      "melvin": "NNP",
      "calvin": "NNP",
      "studied": "VBD",
      "cycle": "NN",
      "thoroughly": "RB",
      "cellular": "JJ",
      "respiration": "NN",
      "rapidly": "RB",
      "produces": "VBZ",
      "energy": "NN",
      "mitochondria": "NN" // or NNS
    }
  }
];

console.log("=== RUNNING CONTEXTUAL POS TAGGER TEST ===");
let allPassed = true;
for (const tc of testCases) {
  console.log(`\nTest Case: ${tc.name}`);
  const result = analyzeText(tc.text);
  console.log("Extracted Terms & Tags:", result.tags);
  for (const [term, expectedTag] of Object.entries(tc.expected)) {
    const actualTag = result.tags[term] || result.tags[term.toLowerCase()] || result.tags[term.charAt(0).toUpperCase() + term.slice(1)];
    const pass = actualTag && (actualTag === expectedTag || (expectedTag === "VBP" && actualTag === "VB") || (expectedTag === "VB" && actualTag === "VBP"));
    if (!pass) {
      console.error(`FAIL: ${term} expected [${expectedTag}] but got [${actualTag}]`);
      allPassed = false;
    } else {
      console.log(`  PASS: ${term} -> [${actualTag}]`);
    }
  }
}

if (allPassed) {
  console.log("\nALL TEST CASES PASSED SUCCESSFULLY!");
} else {
  console.log("\nSome test cases failed.");
  process.exit(1);
}
