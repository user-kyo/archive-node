const RAW_STOP = new Set("a an the is are was were be been am to of in on at for with and or but so then this that these those it its i you he she we they my your our their as by from into about up out if than too very can could would should will just do does did have has had cannot please not no nor never without".split(" "));
const RAW_TL_STOP = new Set("ang ng sa yung na at ay mga ko mo ka ako ikaw siya daw raw po ba din rin lang naman nga pa kasi ito iyan iyon si ni kay hindi wala walang ayaw di".split(" "));
const NEGATIONS = new Set(["not", "no", "nor", "never", "cannot", "without", "hindi", "wala", "walang", "ayaw", "di"]);
const STOP = new Set([...RAW_STOP].filter(x => !NEGATIONS.has(x)));
const TL_STOP = new Set([...RAW_TL_STOP].filter(x => !NEGATIONS.has(x)));
const ALL_STOP = new Set([...STOP, ...TL_STOP]);
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
      // Apostrophe-less contractions
      "im": "i am",
      "cant": "cannot",
      "wont": "will not",
      "dont": "do not",
      "didnt": "did not",
      "doesnt": "does not",
      "isnt": "is not",
      "arent": "are not",
      "wasnt": "was not",
      "werent": "were not",
      "havent": "have not",
      "hasnt": "has not",
      "hadnt": "had not",
      "wouldnt": "would not",
      "couldnt": "could not",
      "shouldnt": "should not",
      "thats": "that is",
      "theres": "there is",
      "whats": "what is",
      "youre": "you are",
      "theyre": "they are",
      "weve": "we have",
      "youve": "you have",
      "theyve": "they have",
      // Standard shortcuts
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
      "prof": "professor",
      // Acronym expansions
      "ocr": "optical character recognition",
      "dna": "deoxyribonucleic acid",
      "rna": "ribonucleic acid",
      "atp": "adenosine triphosphate",
      "cpu": "central processing unit",
      "ram": "random access memory",
      "rom": "read only memory",
      "gui": "graphical user interface",
      "api": "application programming interface",
      "url": "uniform resource locator",
      "http": "hypertext transfer protocol",
      "pdf": "portable document format",
      "ai": "artificial intelligence",
      "ml": "machine learning",
      "nlp": "natural language processing",
      "os": "operating system",
      "pc": "personal computer",
      "html": "hypertext markup language",
      "css": "cascading style sheets",
      "asap": "as soon as possible",
      "fbi": "federal bureau of investigation",
      "cia": "central intelligence agency",
      "nasa": "national aeronautics and space administration",
      "usa": "united states of america",
      "uk": "united kingdom",
      "faq": "frequently asked questions",
      "diy": "do it yourself",
      "vip": "very important person",
      "ceo": "chief executive officer",
      "cfo": "chief financial officer",
      "cto": "chief technology officer",
      "hr": "human resources",
      "pr": "public relations",
      "aka": "also known as",
      "fyi": "for your information",
      "tba": "to be announced",
      "tbd": "to be determined",
      "dob": "date of birth",
      "eta": "estimated time of arrival",
      "rsvp": "please respond",
      "phd": "doctor of philosophy",
      "mba": "master of business administration",
      "gpa": "grade point average",
      "eu": "european union",
      "gdp": "gross domestic product",
      "cpi": "consumer price index",
      "roi": "return on investment",
      "seo": "search engine optimization",
      "usb": "universal serial bus",
      "gps": "global positioning system",
      "sms": "short message service",
      "awol": "absent without leave",
      "pov": "point of view",
      "imo": "in my opinion",
      "tbh": "to be honest"
    };
const KNOWN_WORDS = new Set([
      ...Object.keys(WORDNET_DB),
      ...Object.keys(CAT),
      ...Object.keys(LEMMA),
      ...Object.values(LEMMA),
      ...TL_WORDS,
      ...STOP,
      ...TL_STOP,
      ...NEGATIONS,
      ...NONTERM,
      // Common Academic, Study, & Science vocabulary
      "biology", "chemistry", "physics", "science", "scientific", "concept", "concepts",
      "process", "processes", "system", "systems", "function", "functions", "structure", "structures",
      "chapter", "lesson", "definition", "definitions", "example", "examples", "problem", "solution",
      "question", "questions", "answer", "answers", "method", "methods", "theory", "theories",
      "analysis", "student", "students", "teacher", "teachers", "school", "study", "studying", "notes",
      "review", "produce", "produces", "produced", "product", "products", "production", "absorb", "absorbs", "absorbed",
      "release", "releases", "released", "synthesize", "synthesizes", "convert", "converts", "primary", "secondary",
      "transform", "transforms", "increase", "decrease", "important", "importance", "importantly",
      "different", "difference", "differ", "significant", "significance", "essential", "crucial",
      "cellular", "organism", "organisms", "molecule", "molecules", "compound", "compounds",
      "element", "elements", "temperature", "energy", "matter", "living", "nonliving",
      "light", "dark", "reaction", "reactions", "rate", "state", "change", "changes",
      "volume", "mass", "weight", "density", "human", "body", "organ", "organs",
      "tissue", "tissues", "blood", "gas", "gases", "solid", "liquid", "solution", "solutions",
      "substance", "substances", "property", "properties", "evidence", "statement", "statements",
      "requirement", "requirements", "performance", "existence", "maintenance", "resistance",
      "absorbance", "confidence", "relevance", "presence", "patience", "intelligence",
      "convenience", "independence", "sequence", "sequences", "consequence", "consequences",
      "distance", "distances", "instance", "instances", "circumstance", "circumstances",
      "essence", "sentence", "sentences", "influence", "influences", "reference", "references",
      "experience", "experiences", "patient", "patients", "agent", "agents",
      "hard", "easy", "fast", "slow", "high", "low", "long", "short", "big", "small",
      "true", "false", "right", "wrong", "real", "good", "bad", "new", "old", "great",
      "here", "there", "where", "when", "why", "how", "what", "who", "which",
      "now", "then", "always", "never", "often", "sometimes",
      "find", "give", "take", "keep", "hold", "tell", "say", "know", "think", "see",
      "look", "hear", "feel", "come", "go", "leave", "help", "work", "play", "live",
      "need", "want", "mean", "seem", "part", "time", "year", "day", "way", "thing",
      "man", "world", "life", "hand", "eye", "place", "case", "point", "group", "fact",
      "form", "word", "line", "page", "text", "note", "read", "write", "book", "food",
      "cool", "really", "free", "tree", "deep", "current", "thinking"
    ]);
const COMMON_TYPOS = {
      "curent": "current",
      "thikning": "thinking",
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
function applyCasing(original, replacement) {
      if (original === original.toUpperCase() && original.length > 1) {
        return replacement.toUpperCase();
      }
      if (original.charAt(0) === original.charAt(0).toUpperCase() && original.charAt(0) !== original.charAt(0).toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement.toLowerCase();
    }
function hasValidMorphology(w) {
      if (w.length < 5) return false;
      // Valid English derivational suffixes (preserves words like importance, difference, etc.)
      if (/(ance|ence|tion|sion|ment|ness|ity|ities|able|ible|ial|al|ic|ical|ive|ous|ious|ful|less|ly|ize|ise|ify|ate|ist|ism|logy)$/.test(w)) {
        return true;
      }
      return false;
    }
function isKnownWord(w) {
      if (typeof FULL_ENGLISH_DICT !== 'undefined' && FULL_ENGLISH_DICT.has(w)) return true;
      if (KNOWN_WORDS.has(w)) return true;
      if (w.endsWith("s") && KNOWN_WORDS.has(w.slice(0, -1))) return true;
      if (w.endsWith("es") && KNOWN_WORDS.has(w.slice(0, -2))) return true;
      if (w.endsWith("ed") && (KNOWN_WORDS.has(w.slice(0, -1)) || KNOWN_WORDS.has(w.slice(0, -2)))) return true;
      if (w.endsWith("ing") && (KNOWN_WORDS.has(w.slice(0, -3)) || KNOWN_WORDS.has(w.slice(0, -3) + "e"))) return true;
      if (hasValidMorphology(w)) return true;
      return false;
    }
function editDistance(a, b) {
      const al = a.length, bl = b.length;
      if (Math.abs(al - bl) > 1) return 99; // Strict edit distance 1 to prevent false autocorrects
      const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
      for (let i = 0; i <= al; i++) dp[i][0] = i;
      for (let j = 0; j <= bl; j++) dp[0][j] = j;

      for (let i = 1; i <= al; i++) {
        for (let j = 1; j <= bl; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
          }
        }
      }
      return dp[al][bl];
    }
function collapseStretched(word) {
      if (!/([A-Za-z])\1/.test(word)) return word; // Fast exit if no repeated letters
      const lower = word.toLowerCase();
      if (isKnownWord(lower)) return word; // Already valid (e.g., "good")

      const groups = [];
      const regex = /([a-z])\1+/g;
      let match;
      let lastIndex = 0;
      const parts = [];

      while ((match = regex.exec(lower)) !== null) {
        parts.push(lower.slice(lastIndex, match.index));
        groups.push(match[1]);
        lastIndex = regex.lastIndex;
      }
      parts.push(lower.slice(lastIndex));

      if (groups.length === 0) return word;

      const numCombos = 1 << groups.length;
      const combos = [];
      for (let i = 0; i < numCombos; i++) {
        let cand = parts[0];
        let doubleCount = 0;
        for (let j = 0; j < groups.length; j++) {
          const char = groups[j];
          const isDouble = (i & (1 << j)) !== 0;
          if (isDouble) doubleCount++;
          cand += isDouble ? char + char : char;
          cand += parts[j + 1];
        }
        combos.push({ cand, doubleCount });
      }

      // Sort by doubleCount to prefer collapsing to single letters first (pleease -> please)
      combos.sort((a, b) => a.doubleCount - b.doubleCount);

      // 1. Check academic KNOWN_WORDS first
      for (const { cand } of combos) {
        if (KNOWN_WORDS.has(cand)) return applyCasing(word, cand);
      }

      // 2. Check full dictionary
      const hasFullDict = typeof FULL_ENGLISH_DICT !== 'undefined';
      if (hasFullDict) {
        for (const { cand } of combos) {
          if (FULL_ENGLISH_DICT.has(cand)) return applyCasing(word, cand);
        }
      }

      // 3. Fallback: just compress 3+ repeats to 1 if it wasn't a valid word, to prevent extremely long stretches
      if (/([A-Za-z])\1{2,}/.test(word)) {
        const fallback = lower.replace(/([a-z])\1{2,}/g, "$1");
        return applyCasing(word, fallback);
      }

      return word;
    }
function autocorrectWord(word) {
      const lower = word.toLowerCase();
      // CRITICAL GUARD: Already-known, morphologically valid, or short words must NEVER be changed!
      if (isKnownWord(lower) || lower.length <= 2 || /^\d+$/.test(lower)) {
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

      // 1. Contractions expansion (Chapter 7: e.g. couldn't -> could not, it's -> it is, you're -> you are)
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
      // Slash shortcuts
      s = s.replace(/\b(w\/o|w\/|b\/c)\b/gi, (match) => {
        const l = match.toLowerCase();
        if (SHORTCUTS[l]) {
          const repl = applyCasing(match, SHORTCUTS[l]);
          recordCorrection(match, repl);
          return repl;
        }
        return match;
      });

      // Standard word shortcuts
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
        if (/([A-Za-z])\1/.test(match) && !isKnownWord(match.toLowerCase())) {
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

      // 5. Likely OCR confusions corrected (Chapter 7)
      s = s.replace(/\bchlorophy11\b/gi, (m) => { recordCorrection(m, "chlorophyll"); return "chlorophyll"; })
           .replace(/\bsunllght\b/gi, (m) => { recordCorrection(m, "sunlight"); return "sunlight"; })
           .replace(/(\b[a-z]+)11\b/gi, "$1ll")
           .replace(/(\b[a-z]+)1([a-z]+\b)/gi, "$1l$2")
           .replace(/(\b[a-z]+)0([a-z]+\b)/gi, "$1o$2");

      // 6. Run-on notes spacing for sentence and word splitting (Chapters 3 & 4)
      s = s.replace(/([.!?])([A-Za-z])/g, "$1 $2").replace(/,([A-Za-z])/g, ", $2");
      s = s.replace(/[ \t]+/g, " ").trim();

      // 7. Intelligent Spell Checking & Error Autocorrection for Cleaned Words Section
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
console.log(normalize('The test is not easy, hindi siya madali.'));