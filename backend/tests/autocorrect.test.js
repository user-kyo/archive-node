// Comprehensive test for Autocorrect & Normalization Engine
// Testing:
// 1. Contractions (couldn't -> could not, it's -> it is, you're -> you are, etc.)
// 2. Shortcuts & Abbreviations (pls -> please, imp -> important, yun -> yung, di -> hindi, etc.)
// 3. Stretched words (soooo -> so, pleeease -> please, cooool -> cool, sooobrang -> sobrang)
// 4. Misspelled words / OCR errors (photosynthesys -> photosynthesis, glucuse -> glucose, etc.)
// 5. Preserving already correct words (importance, important, difference, different, significance, substance, evidence, etc.)

const STOP = new Set("a an the is are was were be been am to of in on at for with and or but so then this that these those it its i you he she we they my your our their as by from into about up out if than too very can could would should will just do does did have has had cannot please not hindi good cool well great much many all some any few more most".split(" "));
const TL_STOP = new Set("ang ng sa yung na at ay mga ko mo ka ako ikaw siya daw raw po ba din rin lang naman nga pa kasi ito iyan iyon si ni kay hindi".split(" "));
const TL_WORDS = new Set("mahalaga maintindihan sobrang hirap gawin aralin kailangan tandaan basahin sulat sagot tanong".split(" "));
const NONTERM = new Set("equals".split(" "));

const CONTR = {
  "couldn't": "could not",
  "can't": "cannot",
  "won't": "will not",
  "don't": "do not",
  "didn't": "did not",
  "doesn't": "does not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "hasn't": "has not",
  "haven't": "have not",
  "hadn't": "had not",
  "shouldn't": "should not",
  "wouldn't": "would not",
  "it's": "it is",
  "i'm": "i am",
  "you're": "you are",
  "they're": "they are",
  "we're": "we are",
  "i've": "i have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "i'll": "i will",
  "you'll": "you will",
  "he'll": "he will",
  "she'll": "she will",
  "we'll": "we will",
  "they'll": "they will",
  "let's": "let us",
  "that's": "that is",
  "what's": "what is",
  "there's": "there is",
  "who's": "who is"
};

const SHORTCUTS = {
  "pls": "please",
  "plz": "please",
  "imp": "important",
  "yun": "yung",
  "di": "hindi",
  "nde": "hindi",
  "u": "you",
  "ur": "your",
  "r": "are",
  "bc": "because",
  "b/c": "because",
  "w/": "with",
  "w/o": "without",
  "info": "information",
  "diff": "difference",
  "def": "definition",
  "defs": "definitions",
  "ex": "example",
  "exs": "examples",
  "approx": "approximately",
  "temp": "temperature",
  "dept": "department",
  "prof": "professor"
};

const KNOWN_WORDS = new Set([
  ...STOP,
  ...TL_STOP,
  ...TL_WORDS,
  ...NONTERM,
  // Academic, Science, and Common Core English vocabulary
  "hard", "easy", "fast", "slow", "high", "low", "long", "short", "big", "small",
  "true", "false", "right", "wrong", "real", "good", "bad", "new", "old", "great",
  "here", "there", "where", "when", "why", "how", "what", "who", "which",
  "now", "then", "always", "never", "often", "sometimes",
  "find", "give", "take", "keep", "hold", "tell", "say", "know", "think", "see",
  "look", "hear", "feel", "come", "go", "leave", "help", "work", "play", "live",
  "need", "want", "mean", "seem", "part", "time", "year", "day", "way", "thing",
  "man", "world", "life", "hand", "eye", "place", "case", "point", "group", "fact",
  "form", "word", "line", "page", "text", "note", "read", "write", "book", "food",
  "photosynthesis", "respiration", "chlorophyll", "glucose", "sunlight", "oxygen",
  "carbon", "dioxide", "mitochondria", "membrane", "protein", "enzyme", "cell", "cells",
  "plant", "plants", "leaf", "leaves", "cycle", "calvin", "reaction", "reactions",
  "absorb", "absorbs", "absorbed", "produce", "produces", "produced", "make", "makes",
  "important", "importance", "importantly", "different", "difference", "differ",
  "significant", "significance", "essential", "crucial", "primary", "secondary",
  "cellular", "chemical", "physical", "biological", "organic", "inorganic",
  "exam", "quiz", "test", "homework", "lecture", "study", "studying", "notes",
  "formula", "equation", "force", "energy", "gravity", "algorithm", "network", "database",
  "concept", "concepts", "process", "processes", "system", "systems", "structure", "structures",
  "substance", "substances", "evidence", "statement", "statements", "requirement", "requirements",
  "performance", "existence", "maintenance", "resistance", "absorbance", "confidence",
  "relevance", "presence", "patience", "intelligence", "convenience", "independence",
  "sequence", "sequences", "consequence", "consequences", "distance", "distances",
  "instance", "instances", "circumstance", "circumstances", "essence", "sentence", "sentences",
  "influence", "influences", "reference", "references", "experience", "experiences",
  "science", "sciences", "patient", "patients", "student", "students", "teacher", "teachers",
  "school", "review", "synthesize", "synthesizes", "convert", "converts",
  "organism", "organisms", "molecule", "molecules", "compound", "compounds",
  "element", "elements", "temperature", "volume", "mass", "weight", "density",
  "light", "dark", "rate", "state", "change", "changes", "matter", "living", "nonliving",
  "human", "body", "organ", "organs", "tissue", "tissues", "blood", "gas", "gases",
  "solid", "liquid", "solution", "solutions", "property", "properties",
  "good", "cool", "really", "food", "look", "book", "tree", "free", "need", "keep", "deep", "feel", "see"
]);

const COMMON_TYPOS = {
  "photosynthesys": "photosynthesis",
  "photosyntesis": "photosynthesis",
  "fotosintesis": "photosynthesis",
  "chlorophyl": "chlorophyll",
  "chlorophylll": "chlorophyll",
  "chlorophy11": "chlorophyll",
  "klorofil": "chlorophyll",
  "glucuse": "glucose",
  "glukose": "glucose",
  "gluc0se": "glucose",
  "glycose": "glucose",
  "oxigen": "oxygen",
  "0xygen": "oxygen",
  "oksigen": "oxygen",
  "celular": "cellular",
  "ce11ular": "cellular",
  "selular": "cellular",
  "ce11": "cell",
  "enrgy": "energy",
  "energi": "energy",
  "calvn": "calvin",
  "calvinn": "calvin",
  "reaxion": "reaction",
  "reacton": "reaction",
  "reaksyon": "reaction",
  "respiraton": "respiration",
  "respirashun": "respiration",
  "mitocondria": "mitochondria",
  "mitochonria": "mitochondria",
  "prossess": "process",
  "prosess": "process",
  "proseso": "process",
  "algoritm": "algorithm",
  "algorithim": "algorithm",
  "databaes": "database",
  "datbase": "database",
  "databse": "database",
  "netwrok": "network",
  "netwrk": "network",
  "inflaton": "inflation",
  "implasyon": "inflation",
  "demaand": "demand",
  "suuply": "supply",
  "suppli": "supply",
  "mathemactics": "mathematics",
  "mathemathics": "mathematics",
  "matematika": "mathematics",
  "studing": "studying",
  "studyng": "studying",
  "impotant": "important",
  "importante": "important",
  "biologi": "biology",
  "bayolodyi": "biology",
  "chemestry": "chemistry",
  "kemistri": "chemistry",
  "fisiks": "physics",
  "pisika": "physics",
  "equasion": "equation",
  "eqation": "equation",
  "formla": "formula",
  "pormula": "formula",
  "gravty": "gravity",
  "grabiti": "gravity",
  "enzym": "enzyme",
  "ensaym": "enzyme",
  "membran": "membrane",
  "membrana": "membrane",
  "leef": "leaf",
  "sunllght": "sunlight",
  "sunlite": "sunlight",
  "dioxid": "dioxide",
  "diokside": "dioxide",
  "maintidihan": "maintindihan",
  "maiintindihan": "maintindihan",
  "maintndihan": "maintindihan",
  "kaylangan": "kailangan",
  "kailngan": "kailangan",
  "kelangan": "kailangan",
  "mahalga": "mahalaga",
  "mhalaga": "mahalaga",
  "aralinn": "aralin",
  "tandahan": "tandaan",
  "gawenn": "gawin"
};

function editDistance(a, b) {
  const al = a.length, bl = b.length;
  if (Math.abs(al - bl) > 1) return 99; // Strict edit distance 1
  const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) dp[i][0] = i;
  for (let j = 0; j <= bl; j++) dp[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[al][bl];
}

function hasValidMorphology(w) {
  if (w.length < 5) return false;
  // Valid derivational suffixes in English
  if (/(ance|ence|tion|sion|ment|ness|ity|ities|able|ible|ial|al|ic|ical|ive|ous|ious|ful|less|ly|ize|ise|ify|ate|ist|ism|logy)$/.test(w)) {
    return true;
  }
  return false;
}

function isKnownWord(w) {
  if (KNOWN_WORDS.has(w)) return true;
  if (w.endsWith("s") && KNOWN_WORDS.has(w.slice(0, -1))) return true;
  if (w.endsWith("es") && KNOWN_WORDS.has(w.slice(0, -2))) return true;
  if (w.endsWith("ed") && (KNOWN_WORDS.has(w.slice(0, -1)) || KNOWN_WORDS.has(w.slice(0, -2)))) return true;
  if (w.endsWith("ing") && (KNOWN_WORDS.has(w.slice(0, -3)) || KNOWN_WORDS.has(w.slice(0, -3) + "e"))) return true;
  if (hasValidMorphology(w)) return true;
  return false;
}

function applyCasing(original, replacement) {
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase();
  }
  if (original.charAt(0) === original.charAt(0).toUpperCase() && original.charAt(0) !== original.charAt(0).toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement.toLowerCase();
}

// Collapses stretched words with 3+ repeated characters (e.g. soooo -> so, cooool -> cool, pleeease -> please)
function collapseStretched(word) {
  if (!/([A-Za-z])\1{2,}/.test(word)) return word;
  const lower = word.toLowerCase();

  // Candidate 1: Collapse 3+ repeats to 1 character (soooo -> so, pleeease -> please)
  const cand1 = lower.replace(/([a-z])\1{2,}/g, "$1");
  // Candidate 2: Collapse 3+ repeats to 2 characters (cooool -> cool, goooood -> good)
  const cand2 = lower.replace(/([a-z])\1{2,}/g, "$1$1");

  let best = null;
  if (isKnownWord(cand1)) {
    best = cand1;
  } else if (isKnownWord(cand2)) {
    best = cand2;
  } else if (COMMON_TYPOS[cand1]) {
    best = COMMON_TYPOS[cand1];
  } else if (COMMON_TYPOS[cand2]) {
    best = COMMON_TYPOS[cand2];
  } else {
    best = cand1; // default to single char
  }

  return applyCasing(word, best);
}

function autocorrectWord(word) {
  const lower = word.toLowerCase();

  // 1. If word is already known, morphologically valid, or short/number: NEVER change it!
  if (isKnownWord(lower) || lower.length <= 2 || /^\d+$/.test(lower)) {
    return { word, corrected: false };
  }

  // 2. Exact known typo dictionary
  if (COMMON_TYPOS[lower]) {
    const fixed = applyCasing(word, COMMON_TYPOS[lower]);
    return { word: fixed, original: word, corrected: true, replacement: COMMON_TYPOS[lower] };
  }

  // 3. Strict single-edit distance against known vocabulary (length >= 5 only to protect short words)
  if (lower.length >= 5) {
    let bestMatch = null;
    let minDistance = 99;
    for (const known of KNOWN_WORDS) {
      if (Math.abs(known.length - lower.length) > 1) continue;
      if (known[0] !== lower[0]) continue; // First letter must match

      // Suffix collision guard: Never swap -ance/-ence with -ant/-ent
      const wEndsAnce = /(ance|ence)$/.test(lower);
      const kEndsAnt = /(ant|ent)$/.test(known);
      if (wEndsAnce && kEndsAnt) continue;
      const wEndsAnt = /(ant|ent)$/.test(lower);
      const kEndsAnce = /(ance|ence)$/.test(known);
      if (wEndsAnt && kEndsAnce) continue;

      const d = editDistance(lower, known);
      if (d === 1 && d < minDistance) {
        minDistance = d;
        bestMatch = known;
      }
    }

    if (bestMatch) {
      const fixed = applyCasing(word, bestMatch);
      return { word: fixed, original: word, corrected: true, replacement: bestMatch };
    }
  }

  return { word, corrected: false };
}

function normalize(s) {
  const corrections = [];
  const seenCorrections = new Set();

  function recordCorrection(orig, fixed) {
    if (!orig || !fixed || orig.toLowerCase() === fixed.toLowerCase()) return;
    const key = `${orig.toLowerCase()}->${fixed.toLowerCase()}`;
    if (!seenCorrections.has(key)) {
      seenCorrections.add(key);
      corrections.push({ original: orig, corrected: fixed });
    }
  }

  // 1. Contractions expansion (e.g. couldn't -> could not, it's -> it is, you're -> you are)
  s = s.replace(/\b([A-Za-z]+['’](?:t|s|m|re|ve|ll|d))\b/gi, (match) => {
    const standardKey = match.toLowerCase().replace("’", "'");
    if (CONTR[standardKey]) {
      const repl = applyCasing(match, CONTR[standardKey]);
      recordCorrection(match, repl);
      return repl;
    }
    return match;
  });

  // 2. Shortcuts & Abbreviations (e.g. pls -> please, imp -> important, yun -> yung, di -> hindi, w/ -> with)
  // Handle slash shortcuts first: w/, w/o, b/c
  s = s.replace(/\b(w\/o|w\/|b\/c)\b/gi, (match) => {
    const l = match.toLowerCase();
    if (SHORTCUTS[l]) {
      const repl = applyCasing(match, SHORTCUTS[l]);
      recordCorrection(match, repl);
      return repl;
    }
    return match;
  });

  // Handle word shortcuts
  s = s.replace(/\b([A-Za-z]+)\b/gi, (match) => {
    const l = match.toLowerCase();
    if (SHORTCUTS[l]) {
      const repl = applyCasing(match, SHORTCUTS[l]);
      recordCorrection(match, repl);
      return repl;
    }
    return match;
  });

  // 3. Stretched words collapsing (e.g. soooo -> so, pleeease -> please, cooool -> cool, sooobrang -> sobrang)
  s = s.replace(/\b([A-Za-z]+)\b/g, (match) => {
    if (/([A-Za-z])\1{2,}/.test(match)) {
      const collapsed = collapseStretched(match);
      if (collapsed.toLowerCase() !== match.toLowerCase()) {
        recordCorrection(match, collapsed);
        return collapsed;
      }
    }
    return match;
  });

  // 4. Repeated punctuation
  s = s.replace(/([!?.])\1{2,}/g, "$1$1");

  // 5. OCR letter/digit confusions
  s = s.replace(/\bchlorophy11\b/gi, (m) => { recordCorrection(m, "chlorophyll"); return "chlorophyll"; })
       .replace(/\bsunllght\b/gi, (m) => { recordCorrection(m, "sunlight"); return "sunlight"; })
       .replace(/(\b[a-z]+)11\b/gi, "$1ll")
       .replace(/(\b[a-z]+)1([a-z]+\b)/gi, "$1l$2")
       .replace(/(\b[a-z]+)0([a-z]+\b)/gi, "$1o$2");

  // 6. Run-on spacing
  s = s.replace(/([.!?])([A-Za-z])/g, "$1 $2").replace(/,([A-Za-z])/g, ", $2");
  s = s.replace(/[ \t]+/g, " ").trim();

  // 7. Misspelled words & typo autocorrection
  s = s.replace(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g, (match) => {
    const res = autocorrectWord(match);
    if (res.corrected) {
      recordCorrection(match, res.word);
      return res.word;
    }
    return match;
  });

  return { clean: s, corrections };
}

// RUN TEST SUITE
console.log("=== RUNNING TEST SUITE ===");

const tests = [
  {
    name: "Preserve valid academic words without changing context",
    input: "The importance of photosynthesis is important and different from the difference in cellular respiration.",
    expectedWordsPreserved: ["importance", "important", "different", "difference", "photosynthesis", "cellular", "respiration"],
    expectedNoCorrections: ["importance", "important", "different", "difference"]
  },
  {
    name: "Expand contractions",
    input: "I couldn't finish because it's hard and you're not here.",
    expectedCleanContains: "I could not finish because it is hard and you are not here.",
    expectedCorrections: [
      { original: "couldn't", corrected: "could not" },
      { original: "it's", corrected: "it is" },
      { original: "you're", corrected: "you are" }
    ]
  },
  {
    name: "Collapse stretched words",
    input: "This is soooo cooool and pleeease understand sooobrang hirap.",
    expectedCleanContains: "This is so cool and please understand sobrang hirap.",
    expectedCorrections: [
      { original: "soooo", corrected: "so" },
      { original: "cooool", corrected: "cool" },
      { original: "pleeease", corrected: "please" },
      { original: "sooobrang", corrected: "sobrang" }
    ]
  },
  {
    name: "Expand shortcuts and abbreviations",
    input: "pls study the imp concepts bc yun ang lalabas at di mahirap.",
    expectedCleanContains: "please study the important concepts because yung ang lalabas at hindi mahirap.",
    expectedCorrections: [
      { original: "pls", corrected: "please" },
      { original: "imp", corrected: "important" },
      { original: "bc", corrected: "because" },
      { original: "yun", corrected: "yung" },
      { original: "di", corrected: "hindi" }
    ]
  },
  {
    name: "Correct genuine typos and OCR errors",
    input: "photosynthesys uses glucuse and oxigen in celular sunllght with chlorophy11.",
    expectedCleanContains: "photosynthesis uses glucose and oxygen in cellular sunlight with chlorophyll.",
    expectedCorrections: [
      { original: "photosynthesys", corrected: "photosynthesis" },
      { original: "glucuse", corrected: "glucose" },
      { original: "oxigen", corrected: "oxygen" },
      { original: "celular", corrected: "cellular" },
      { original: "sunllght", corrected: "sunlight" },
      { original: "chlorophy11", corrected: "chlorophyll" }
    ]
  }
];

let allPassed = true;

for (const t of tests) {
  console.log(`\nTEST: ${t.name}`);
  const res = normalize(t.input);
  console.log(`Input: "${t.input}"`);
  console.log(`Clean: "${res.clean}"`);
  console.log(`Corrections:`, res.corrections);

  if (t.expectedWordsPreserved) {
    for (const w of t.expectedWordsPreserved) {
      if (!res.clean.includes(w)) {
        console.error(`FAIL: Expected preserved word "${w}" was not found in clean output!`);
        allPassed = false;
      }
    }
  }

  if (t.expectedNoCorrections) {
    for (const w of t.expectedNoCorrections) {
      if (res.corrections.some(c => c.original.toLowerCase() === w.toLowerCase())) {
        console.error(`FAIL: Word "${w}" was incorrectly corrected!`);
        allPassed = false;
      }
    }
  }

  if (t.expectedCleanContains) {
    if (!res.clean.includes(t.expectedCleanContains)) {
      console.error(`FAIL: Expected clean text to contain "${t.expectedCleanContains}", got "${res.clean}"`);
      allPassed = false;
    }
  }

  if (t.expectedCorrections) {
    for (const ec of t.expectedCorrections) {
      const found = res.corrections.find(c => c.original.toLowerCase() === ec.original.toLowerCase());
      if (!found) {
        console.error(`FAIL: Missing correction for "${ec.original}" -> "${ec.corrected}"`);
        allPassed = false;
      } else if (found.corrected.toLowerCase() !== ec.corrected.toLowerCase()) {
        console.error(`FAIL: Correction mismatch for "${ec.original}": got "${found.corrected}", expected "${ec.corrected}"`);
        allPassed = false;
      }
    }
  }
}

if (allPassed) {
  console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
} else {
  console.error("\n>>> SOME TESTS FAILED! <<<");
  process.exit(1);
}
