// Verify that frontend/index.html autocorrect functions work end-to-end
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Extract javascript functions from frontend/index.html
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("Could not find <script> in frontend/index.html");
  process.exit(1);
}

const scriptCode = scriptMatch[1];

// Create a sandbox execution environment
const vm = require('vm');
const dummyElem = {
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  style: {},
  setAttribute: () => {},
  getAttribute: () => null,
  querySelector: () => null,
  querySelectorAll: () => []
};
const sandbox = {
  document: {
    getElementById: () => dummyElem,
    querySelector: () => dummyElem,
    querySelectorAll: () => []
  },
  window: {
    location: { origin: 'http://localhost:3000' },
    addEventListener: () => {},
    scrollTo: () => {}
  },
  console: console,
  fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
  setTimeout: () => {},
  clearTimeout: () => {}
};
vm.createContext(sandbox);

try {
  // Execute relevant declarations up to process
  vm.runInContext(scriptCode, sandbox);
} catch (e) {
  // If some browser DOM code fails, check if normalize is defined
}

const normalize = sandbox.normalize;
const autocorrectWord = sandbox.autocorrectWord;

if (typeof normalize !== 'function') {
  console.error("normalize is not a function in frontend/index.html!");
  process.exit(1);
}

console.log("Successfully extracted normalize and autocorrectWord from frontend/index.html!");

// Test Cases
const tests = [
  {
    name: "Preserve valid words like importance, important, difference, different",
    input: "The importance of photosynthesis is important and has difference from different concepts.",
    expectedPreserved: ["importance", "important", "difference", "different"],
    shouldNotHaveCorrections: ["importance", "important", "difference", "different"]
  },
  {
    name: "Autocorrect stretched words: so to soooo",
    input: "This is soooo cooool and pleeease understand sooobrang hirap.",
    expectedClean: "This is so cool and please understand sobrang hirap.",
    expectedCorrections: [
      { orig: "soooo", corr: "so" },
      { orig: "cooool", corr: "cool" },
      { orig: "pleeease", corr: "please" },
      { orig: "sooobrang", corr: "sobrang" }
    ]
  },
  {
    name: "Autocorrect shortcuts & abbreviations",
    input: "pls study the imp concepts bc yun ang lalabas at di mahirap.",
    expectedClean: "please study the important concepts because yung ang lalabas at hindi mahirap.",
    expectedCorrections: [
      { orig: "pls", corr: "please" },
      { orig: "imp", corr: "important" },
      { orig: "bc", corr: "because" },
      { orig: "yun", corr: "yung" },
      { orig: "di", corr: "hindi" }
    ]
  },
  {
    name: "Autocorrect contractions",
    input: "I couldn't finish because it's hard and you're not here.",
    expectedClean: "I could not finish because it is hard and you are not here.",
    expectedCorrections: [
      { orig: "couldn't", corr: "could not" },
      { orig: "it's", corr: "it is" },
      { orig: "you're", corr: "you are" }
    ]
  },
  {
    name: "Autocorrect misspelled words and OCR errors",
    input: "photosynthesys uses glucuse and oxigen in celular sunllght with chlorophy11.",
    expectedClean: "photosynthesis uses glucose and oxygen in cellular sunlight with chlorophyll.",
    expectedCorrections: [
      { orig: "photosynthesys", corr: "photosynthesis" },
      { orig: "glucuse", corr: "glucose" },
      { orig: "oxigen", corr: "oxygen" },
      { orig: "celular", corr: "cellular" },
      { orig: "sunllght", corr: "sunlight" },
      { orig: "chlorophy11", corr: "chlorophyll" }
    ]
  }
];

let failed = false;

for (const t of tests) {
  console.log(`\nTesting: ${t.name}`);
  const res = normalize(t.input);
  console.log(`Input: "${t.input}"`);
  console.log(`Clean: "${res.clean}"`);
  console.log(`Corrections:`, res.corrections);

  if (t.expectedPreserved) {
    for (const w of t.expectedPreserved) {
      if (!res.clean.includes(w)) {
        console.error(`FAIL: Preserved word "${w}" missing from clean text!`);
        failed = true;
      }
    }
  }

  if (t.shouldNotHaveCorrections) {
    for (const w of t.shouldNotHaveCorrections) {
      if (res.corrections.some(c => c.original.toLowerCase() === w.toLowerCase())) {
        console.error(`FAIL: Word "${w}" was wrongly corrected!`);
        failed = true;
      }
    }
  }

  if (t.expectedClean && res.clean !== t.expectedClean) {
    console.error(`FAIL: Expected clean "${t.expectedClean}", got "${res.clean}"`);
    failed = true;
  }

  if (t.expectedCorrections) {
    for (const ec of t.expectedCorrections) {
      const match = res.corrections.find(c => c.original.toLowerCase() === ec.orig.toLowerCase());
      if (!match) {
        console.error(`FAIL: Missing correction for ${ec.orig} -> ${ec.corr}`);
        failed = true;
      } else if (match.corrected.toLowerCase() !== ec.corr.toLowerCase()) {
        console.error(`FAIL: Mismatch for ${ec.orig}: got ${match.corrected}, expected ${ec.corr}`);
        failed = true;
      }
    }
  }
}

if (!failed) {
  console.log("\n==============================================");
  console.log("ALL TESTS IN frontend/index.html PASSED FLAWLESSLY!");
  console.log("==============================================");
} else {
  console.error("\nTESTS FAILED IN frontend/index.html");
  process.exit(1);
}
