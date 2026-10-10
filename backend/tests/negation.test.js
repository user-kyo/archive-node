// Test script for Negation Preservation in Stopword Filtering

const RAW_STOP = new Set("a an the is are was were be been am to of in on at for with and or but so then this that these those it its i you he she we they my your our their as by from into about up out if than too very can could would should will just do does did have has had cannot please not no nor never without".split(" "));
const RAW_TL_STOP = new Set("ang ng sa yung na at ay mga ko mo ka ako ikaw siya daw raw po ba din rin lang naman nga pa kasi ito iyan iyon si ni kay hindi wala walang ayaw di".split(" "));

const NEGATIONS = new Set(["not", "no", "nor", "never", "cannot", "without", "hindi", "wala", "walang", "ayaw", "di"]);

// Subtraction logic: ensure negations are NEVER removed as stopwords
const STOP = new Set([...RAW_STOP].filter(x => !NEGATIONS.has(x)));
const TL_STOP = new Set([...RAW_TL_STOP].filter(x => !NEGATIONS.has(x)));
const ALL_STOP = new Set([...STOP, ...TL_STOP]);

const CONTR = {
  "couldn't": "could not",
  "don't": "do not"
};

const SHORTCUTS = {
  "di": "hindi",
  "nde": "hindi",
  "yung": "yung" // mock
};

function normalize(s) {
  // Contractions
  s = s.replace(/\b([A-Za-z]+['’](?:t|s|m|re|ve|ll|d))\b/gi, (match) => {
    const standardKey = match.toLowerCase().replace("’", "'");
    return CONTR[standardKey] ? CONTR[standardKey] : match;
  });

  // Shortcuts
  s = s.replace(/\b([A-Za-z]+)\b/gi, (match) => {
    const l = match.toLowerCase();
    return SHORTCUTS[l] ? SHORTCUTS[l] : match;
  });

  return s.trim();
}

function processPipeline(input) {
  // 1. Normalize
  let text = normalize(input);

  // 2. Tokenize Words (mocking the sentence/word tokenization)
  const tokens = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];

  // 3. Filter Stopwords (but keep negations!)
  const filtered = [];
  for (const t of tokens) {
    const l = t.toLowerCase();
    if (!ALL_STOP.has(l)) {
      filtered.push(l);
    }
  }

  return filtered.join(" ");
}

const tests = [
  {
    input: "The test is not easy, hindi siya madali.",
    check: (out) => out === "test not easy hindi madali"
  },
  {
    input: "I do not understand the topic.",
    check: (out) => out.includes("not")
  },
  {
    input: "I couldn't finish the notes.",
    check: (out) => out.includes("not") && !out.includes("couldn't")
  },
  {
    input: "walang klase bukas",
    check: (out) => out.includes("walang")
  },
  {
    input: "di ko maintindihan yung topic",
    check: (out) => out.includes("hindi") && !out.split(" ").includes("di")
  },
  {
    input: "The cell is the basic unit of life.",
    check: (out) => out === "cell basic unit life"
  }
];

let allPassed = true;

console.log("=== RUNNING NEGATION PRESERVATION TESTS ===\n");

for (let i = 0; i < tests.length; i++) {
  const t = tests[i];
  const output = processPipeline(t.input);
  console.log(`Test ${i + 1}:`);
  console.log(`Input:  "${t.input}"`);
  console.log(`Output: "${output}"`);
  
  if (t.check(output)) {
    console.log("Result: ✅ PASS\n");
  } else {
    console.log("Result: ❌ FAIL\n");
    allPassed = false;
  }
}

if (allPassed) {
  console.log(">>> ALL TESTS PASSED SUCCESSFULLY! <<<");
} else {
  console.log(">>> SOME TESTS FAILED! <<<");
  process.exit(1);
}
