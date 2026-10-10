
        const KNOWN_WORDS = new Set([
      
      
      
      
      
      
      
      
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
      "cool", "really", "free", "tree", "deep"
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

    function hasValidMorphology(w) {
      if (w.length < 5) return false;
      // Valid English derivational suffixes (preserves words like importance, difference, etc.)
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

    // Collapse stretched words with 3+ repeated characters (e.g. soooo -> so, pleeease -> please, cooool -> cool)
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
        best = cand1;
      }

      return applyCasing(word, best);
    }

    function autocorrectWord(word) {
      const lower = word.toLowerCase();
      // CRITICAL GUARD: Already-known, morphologically valid, or short words must NEVER be changed!
      if (isKnownWord(lower) || lower.length <= 2 || /^\d+$/.test(lower)) {
        return { word, corrected: false };
      }

      // Exact known typos map
      if (COMMON_TYPOS[lower]) {
        const fixed = applyCasing(word, COMMON_TYPOS[lower]);
        return { word: fixed, original: word, corrected: true, replacement: COMMON_TYPOS[lower] };
      }

      // Strict single-edit distance against known vocabulary (length >= 5 only to protect short words)
      if (lower.length >= 5) {
        let bestMatch = null;
        let minDistance = 99;
        for (const known of KNOWN_WORDS) {
          if (Math.abs(known.length - lower.length) > 1) continue;
          if (known[0] !== lower[0]) continue; // First letter must match

          // Suffix collision guard: Never swap -ance/-ence with -ant/-ent (e.g. importance vs important)
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

    console.log("curent ->", autocorrectWord("curent"));
    console.log("thikning ->", autocorrectWord("thikning"));
  