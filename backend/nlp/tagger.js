// Rule-Based Contextual POS Tagger (NLTK Chapter 9 & Brill-style contextual rules)

const CONTR = {
  "couldn't": "could not",
  "can't": "cannot",
  "won't": "will not",
  "don't": "do not",
  "didn't": "did not",
  "isn't": "is not",
  "it's": "it is",
  "i'm": "i am"
};

const path = require('path');
const fs = require('fs');

let STOP_WORDS = new Set("a an the is are was were be been am to of in on at for with and or but so then this that these those it its i you he she we they my your our their as by from into about up out if than too very just do does did have has had cannot please not hindi because though through before after while during between".split(" "));
try {
  const swPath = path.join(__dirname, '..', 'data', 'nltk_stopwords.json');
  if (fs.existsSync(swPath)) {
    const loaded = JSON.parse(fs.readFileSync(swPath, 'utf-8'));
    loaded.forEach(w => STOP_WORDS.add(w.toLowerCase()));
  }
} catch (_) {}

const TL_STOP = new Set("ang ng sa yung na at ay mga ko mo ka ako ikaw siya kami tayo kayo sila niya namin natin ninyo nila akin iyo kaniya kanya atin amin inyo kanila daw raw po opo ho oho ba din rin lang lamang naman nga pa kasi ito iyan iyon dine dito diyan doon ire nito niyan noon ganito ganyan ganoon gayon si ni kay sina nina kina pero ngunit subalit habang kung kapag pag dahil sapagkat kaya basta kahit sana pala muna tuloy yata talaga hindi wala walang ayaw di".split(" "));
const TL_WORDS = new Set("mahalaga maintindihan sobrang hirap mahirap madali gawin aralin kailangan tandaan basahin sulat sagot tanong katanungan paliwanag halimbawa katotohanan kaalaman agham kasaysayan lipunan bansa bayan mamamayan pamahalaan kultura panitikan wika salita pangungusap buhay kalikasan lupa tubig hangin apoy araw buwan bituin halaman hayop katawan mundo estudyante guro paaralan aklat libro papel maganda masaya malungkot malaki maliit mataas mababa totoo tama mali mabuti masama magaling marami kaunti lahat iba buo ngayon bukas kahapon kanina mamaya palagi minsan madalas mabilis matagal sandali saan kailan bakit paano ano sino alin nasaan kanino gaano ilan kumusta darating dumating kain kumain basa sumulat gawa ginawa punta pumunta aral nag-aaral alam nakita tingin sabi kwento tulong bili bigay kuha hawak lakad takbo tulog naniniwala paniniwala".split(" "));
const TL_ROOTS = new Set([
  "dating", "kain", "basa", "sulat", "gawa", "punta", "aral", "tanda", "hirap", "alam",
  "kita", "tingin", "dinig", "sabi", "usap", "tulong", "bili", "bigay", "kuha", "hawak",
  "dala", "lakad", "takbo", "tulog", "gising", "tawa", "iyak", "sakay", "baba", "pasok",
  "labas", "tayo", "upo", "lipad", "langoy", "laro", "turo", "kinig", "isip", "damdam",
  "subok", "gamit", "buo", "ayos", "linis", "pili", "hanap", "buhay", "bahay", "patay",
  "sama", "hiwalay", "lipat", "tira", "tagal", "bilis", "ganda", "pangit", "bait", "laki",
  "liit", "taas", "haba", "ikli", "lapit", "layo", "dami", "unti", "saya", "lungkot",
  "galit", "takot", "tapang", "hiya", "galing", "gutom", "uhaw", "pagod", "init", "lamig",
  "bata", "tanda", "linaw", "labo", "dilim", "liwanag", "bigat", "gaan", "tamis", "pait",
  "alat", "asim", "anghang", "linamnam", "bango", "baho", "tibay", "hina", "sakit",
  "bayan", "tao", "guro", "paaralan", "tubig", "lupa", "hangin", "araw", "gabi", "mundo",
  "kultura", "panitikan", "wika", "lipunan", "pamahalaan", "kasaysayan", "katotohanan",
  "pamilya", "kaibigan", "silid", "aklat", "libro", "papel", "tanong", "sagot", "agham",
  "daan", "taas", "noon", "doon", "totoo", "saan", "kailan", "bakit", "paano", "ano", "sino"
]);

const DETERMINERS = new Set(["the", "a", "an", "this", "that", "these", "those", "every", "each", "some", "any", "all", "both", "yung"]);
const MODALS = new Set(["can", "could", "will", "would", "shall", "should", "may", "might", "must", "cannot"]);
const COPULAS = new Set(["is", "am", "are", "was", "were", "be", "been", "being"]);
const AUX_HAVE = new Set(["have", "has", "had"]);
const AUX_DO = new Set(["do", "does", "did"]);
const INTENSIFIERS = new Set(["very", "so", "too", "really", "quite", "extremely", "pretty", "just"]);
const PREPOSITIONS = new Set(["in", "on", "at", "to", "for", "with", "by", "from", "into", "through", "during", "between", "under", "over", "about", "sa", "ng"]);
const PRONOUNS = new Set(["i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "ko", "mo", "ka", "ako", "ikaw", "siya"]);
const HONORIFICS = new Set(["ma'am", "maam", "sir", "dr", "dr.", "prof", "prof.", "mr", "mr.", "mrs", "mrs.", "ms", "ms."]);

// Academic / science verbs
const KNOWN_VERBS = new Set([
  "absorb", "make", "produce", "synthesize", "convert", "release", "study", "finish", "ask",
  "require", "contain", "involve", "form", "create", "occur", "break", "combine", "generate",
  "transfer", "store", "yield", "carry", "regulate", "control", "increase", "decrease", "change",
  "solve", "measure", "observe", "calculate", "write", "read", "examine", "describe", "explain"
]);

// Academic / science adjectives
const KNOWN_ADJECTIVES = new Set([
  "important", "crucial", "essential", "primary", "secondary", "vital", "significant",
  "cellular", "chemical", "physical", "biological", "organic", "inorganic", "photosynthetic",
  "metabolic", "molecular", "aerobic", "anaerobic", "light", "dark", "equal", "constant",
  "complex", "simple", "direct", "indirect", "internal", "external", "active", "passive"
]);

// Academic / science nouns
const KNOWN_NOUNS = new Set([
  "photosynthesis", "chlorophyll", "glucose", "sunlight", "oxygen", "carbon", "dioxide",
  "respiration", "mitochondria", "membrane", "protein", "enzyme", "cell", "plant", "leaf",
  "cycle", "calvin", "reaction", "demand", "supply", "inflation", "market", "price", "cost",
  "exam", "quiz", "test", "homework", "lecture", "formula", "equation", "force", "energy",
  "gravity", "algorithm", "network", "database", "concept", "process", "system", "structure",
  "cause", "effect", "result"
]);

let KNOWN_ENTITIES = new Set(["melvin", "calvin", "reyes", "newton", "mendel", "einstein", "darwin"]);
try {
  const namesPath = path.join(__dirname, '..', 'data', 'nltk_names.json');
  if (fs.existsSync(namesPath)) {
    const loaded = JSON.parse(fs.readFileSync(namesPath, 'utf-8'));
    loaded.forEach(n => KNOWN_ENTITIES.add(n.toLowerCase()));
  }
} catch (_) {}

const LEMMA = {
  leaves: "leaf",
  teeth: "tooth",
  feet: "foot",
  mice: "mouse",
  children: "child",
  men: "man",
  women: "woman",
  people: "person",
  data: "datum",
  analyses: "analysis",
  hypotheses: "hypothesis"
};

function getLemma(w) {
  const l = w.toLowerCase();
  if (LEMMA[l]) return LEMMA[l];
  if (l.endsWith("ies") && l.length > 4) return l.slice(0, -3) + "y";
  if (l.endsWith("es") && /(ch|sh|x|ss|zz)es$/i.test(l)) return l.slice(0, -2);
  if (l.length > 4 && l.endsWith("s") && !/(ss|us|is)$/.test(l)) return l.slice(0, -1);
  return l;
}

// Suffix / Morphological analysis
function morphologyTag(w) {
  const l = w.toLowerCase();
  if (l.endsWith("ly") && l.length > 4) return "RB";
  if (/(\b[a-z]+)(able|ible|ous|ious|ful|less|ive|ic|ical|al)$/.test(l)) return "JJ";
  if (/(\b[a-z]+)(tion|sion|ment|ness|ity|sis|logy|ist|ism|ance|ence)$/.test(l)) return "NN";
  if (l.endsWith("ing") && l.length > 5) return "VBG";
  if (l.endsWith("ed") && l.length > 4) return "VBD";
  if (/(\b[a-z]+)(ize|ise|ify|ate)$/.test(l)) return "VB";
  return null;
}

function stemTagalog(w) {
  if (!w) return "";
  const l = w.toLowerCase().replace(/[^a-zñ-]/g, '');
  if (TL_WORDS.has(l) || TL_ROOTS.has(l)) return l;

  // Intervocalic d/r alternation with reduplication (e.g. da-ra-ting -> dating, da-ra-mi -> dami)
  if (/^d([aeiou])r\1/i.test(l)) {
    const v = l[1];
    const rest = l.slice(4);
    const rootCand = 'd' + v + rest;
    if (TL_ROOTS.has(rootCand) || TL_WORDS.has(rootCand)) return rootCand;
  }

  // Reduplication check: CV reduplication (e.g. da-dating, ka-kain, ba-basa, su-sulat, pu-punta)
  if (l.length >= 4 && l[0] === l[2] && l[1] === l[3]) {
    const root = l.slice(2);
    if (TL_ROOTS.has(root) || TL_WORDS.has(root)) return root;
  }

  // Prefix stripping: nag-, mag-, na-, ma-, pag-, i-
  let stem = l;
  if (/^(ipinag|pinag|nagpa|magpa|nakipag|makipag)/.test(stem)) {
    stem = stem.replace(/^(ipinag|pinag|nagpa|magpa|nakipag|makipag)/, '');
  } else if (/^(nag|mag|pag|ipag)/.test(stem)) {
    stem = stem.slice(3);
  } else if (/^(na|ma|pa|ka|sa)/.test(stem)) {
    stem = stem.slice(2);
  } else if (stem.startsWith("i-")) {
    stem = stem.slice(2);
  } else if (stem.startsWith("i") && stem.length > 3) {
    stem = stem.slice(1);
  }
  
  if (TL_WORDS.has(stem) || TL_ROOTS.has(stem)) return stem;
  if (stem.length >= 4 && stem[0] === stem[2] && stem[1] === stem[3]) {
    const root = stem.slice(2);
    if (TL_ROOTS.has(root) || TL_WORDS.has(root)) return root;
  }

  // Infix stripping: -um-, -in-
  if (stem.length > 4 && (stem.slice(1, 3) === "um" || stem.slice(1, 3) === "in")) {
    const uninfixed = stem.charAt(0) + stem.slice(3);
    if (TL_WORDS.has(uninfixed) || TL_ROOTS.has(uninfixed)) return uninfixed;
    if (uninfixed.length >= 4 && uninfixed[0] === uninfixed[2] && uninfixed[1] === uninfixed[3]) {
      const root = uninfixed.slice(2);
      if (TL_ROOTS.has(root) || TL_WORDS.has(root)) return root;
    }
  }

  // Suffix stripping: -an, -in, -han, -hin
  if (stem.endsWith("han") || stem.endsWith("hin")) {
    const s = stem.slice(0, -3);
    if (TL_WORDS.has(s) || TL_ROOTS.has(s)) return s;
  }
  if (stem.endsWith("an") || stem.endsWith("in")) {
    const s = stem.slice(0, -2);
    if (TL_WORDS.has(s) || TL_ROOTS.has(s)) return s;
    if (s.length >= 4 && s[0] === s[2] && s[1] === s[3]) {
      const root = s.slice(2);
      if (TL_ROOTS.has(root) || TL_WORDS.has(root)) return root;
    }
  }

  return l;
}

function normalizeText(s) {
  s = s.replace(/\b[\w']+n't\b|\bit's\b|\bi'm\b/gi, m => CONTR[m.toLowerCase()] || m);
  s = s.replace(/\b(w\/o|w\/|b\/c)\b/gi, m => {
    const l = m.toLowerCase();
    return l === "w/" ? "with" : (l === "w/o" ? "without" : "because");
  });
  s = s.replace(/(?<![A-Za-z0-9])(?:['’])?(coz|cuz|cause|bcoz|bcuz|bcos)\b/gi, (m, word) => {
    if (word.toLowerCase() === 'cause' && !/^['’]/.test(m)) return m;
    return /^[A-Z]/.test(m.replace(/^['’]/, '')) ? 'Because' : 'because';
  });
  s = s.replace(/\bpls\b/gi, "please").replace(/\bimp\b/gi, "important");
  s = s.replace(/\btho\b/gi, "though").replace(/\bthru\b/gi, "through");
  s = s.replace(/\brn\b/gi, "right now").replace(/\btbh\b/gi, "to be honest").replace(/\bidk\b/gi, "i do not know");
  s = s.replace(/\bb4\b/gi, "before").replace(/\bgr8\b/gi, "great");
  s = s.replace(/\b(bkt)\b/gi, "bakit").replace(/\b(pano)\b/gi, "paano");
  s = s.replace(/\b(sya|cya)\b/gi, "siya").replace(/\b(tlga)\b/gi, "talaga");
  s = s.replace(/\b(pede|pwede)\b/gi, "puwede").replace(/\b(dpt)\b/gi, "dapat");
  s = s.replace(/\b(kelangan)\b/gi, "kailangan");
  s = s.replace(/\byun\b/gi, "yung").replace(/\b(di|nde)\b/gi, "hindi");
  s = s.replace(/([A-Za-z])\1{2,}/g, "$1").replace(/([!?.])\1{2,}/g, "$1$1");
  return s;
}

// Tokenize text into sentences and word tokens
function tokenizeSentences(text) {
  const normalized = normalizeText(text);
  const cleanText = normalized
    .replace(/([.!?])([A-Za-z])/g, "$1 $2")
    .replace(/,([A-Za-z])/g, ", $2")
    .replace(/[ \t]+/g, " ");

  const rawSentences = cleanText.split(/(?<=[.!?])\s+|\n+/).filter(s => s.trim().length > 0);
  const sentences = [];

  for (const s of rawSentences) {
    const tokens = [];
    const regex = /[A-Za-z][A-Za-z'-]*/g;
    let match;
    while ((match = regex.exec(s)) !== null) {
      tokens.push({
        text: match[0],
        lower: match[0].toLowerCase(),
        index: match.index,
        isCapitalized: /^[A-Z]/.test(match[0]),
        tag: null
      });
    }
    if (tokens.length > 0) {
      sentences.push({ text: s, tokens });
    }
  }
  return sentences;
}

// Contextual POS Tagger implementation
function tagSentences(sentences) {
  for (const sent of sentences) {
    const toks = sent.tokens;
    const n = toks.length;

    // Pass 1: Tag closed-class tokens, honorifics, and explicit named entities
    for (let i = 0; i < n; i++) {
      const t = toks[i];
      const l = t.lower;
      const prev = i > 0 ? toks[i - 1] : null;
      const next = i < n - 1 ? toks[i + 1] : null;

      if (DETERMINERS.has(l)) t.tag = "DT";
      else if (MODALS.has(l)) t.tag = "MD";
      else if (COPULAS.has(l)) t.tag = l === "be" ? "VB" : (l === "been" ? "VBN" : (l === "being" ? "VBG" : (l === "was" || l === "were" ? "VBD" : "VBZ")));
      else if (AUX_HAVE.has(l)) t.tag = l === "had" ? "VBD" : "VBZ";
      else if (AUX_DO.has(l)) t.tag = l === "did" ? "VBD" : (l === "does" ? "VBZ" : "VBP");
      else if (PREPOSITIONS.has(l)) t.tag = "IN";
      else if (PRONOUNS.has(l)) t.tag = "PRP";
      else if (TL_STOP.has(l)) t.tag = "TL_STOP";
      else if (TL_WORDS.has(l) || TL_WORDS.has(stemTagalog(l))) t.tag = "TL";
      else if (HONORIFICS.has(l)) t.tag = "NNP";
      else if (KNOWN_ENTITIES.has(l)) t.tag = "NNP";
      else if (prev && HONORIFICS.has(prev.lower)) {
        t.tag = "NNP"; // E.g., Ma'am Reyes, Dr. Calvin
      } else if (t.isCapitalized && next && next.isCapitalized) {
        t.tag = "NNP"; // E.g., Melvin Calvin
      } else if (i > 0 && t.isCapitalized && (!KNOWN_NOUNS.has(l) && !KNOWN_ADJECTIVES.has(l) && !KNOWN_VERBS.has(l))) {
        t.tag = "NNP"; // Proper noun mid-sentence
      }
    }

    // Pass 2: Contextual Rule Applications (N-gram & Syntactic rules)
    for (let i = 0; i < n; i++) {
      const t = toks[i];
      if (t.tag && t.tag !== "TL") continue; // Keep Tagalog words as TL

      const l = t.lower;
      const prev = i > 0 ? toks[i - 1] : null;
      const prev2 = i > 1 ? toks[i - 2] : null;
      const next = i < n - 1 ? toks[i + 1] : null;

      // Rule 1: Modal + [not]? + Verb -> Base Verb VB
      if (prev && (prev.tag === "MD" || prev.lower === "not" && prev2 && prev2.tag === "MD")) {
        t.tag = "VB";
        continue;
      }

      // Rule 2: Infinitive marker "to" + Verb -> Base Verb VB
      if (prev && prev.lower === "to") {
        t.tag = "VB";
        continue;
      }

      // Rule 3: Copula + (Intensifier)* + Word -> Predicate Adjective JJ or Participle
      const isAfterCopula = (prev && COPULAS.has(prev.lower)) ||
        (prev && INTENSIFIERS.has(prev.lower) && prev2 && COPULAS.has(prev2.lower));
      if (isAfterCopula) {
        if (l.endsWith("ing")) {
          t.tag = "VBG";
          continue;
        }
        if (l.endsWith("ed")) {
          t.tag = "VBN";
          continue;
        }
        if (KNOWN_ADJECTIVES.has(l) || morphologyTag(t.text) === "JJ" || !KNOWN_NOUNS.has(l)) {
          t.tag = "JJ";
          continue;
        }
      }

      // Rule 4: Modifier before confirmed noun (Attributive Adjective JJ or Proper NNP)
      if (next && (KNOWN_NOUNS.has(next.lower) || next.lower.endsWith("tion") || next.lower.endsWith("s") && KNOWN_NOUNS.has(getLemma(next.lower)))) {
        if (t.isCapitalized && i > 0) {
          t.tag = "NNP";
          continue;
        }
        if (KNOWN_ADJECTIVES.has(l) || l === "cellular" || l === "light" || l === "dark" || morphologyTag(t.text) === "JJ") {
          t.tag = "JJ";
          continue;
        }
      }

      // Rule 5: Clause-initial Imperative Verb (e.g. "ask Ma'am Reyes", "study chapter 5")
      if ((i === 0 || (prev && (prev.lower === "then" || prev.text.match(/[,;]$/)))) && (KNOWN_VERBS.has(l) || l === "ask" || l === "study" || l === "review" || l === "finish")) {
        t.tag = "VB";
        continue;
      }

      // Rule 6: Subject + Verb agreement
      // 3rd Person Singular Verb VBZ (e.g., "chlorophyll ... absorbs sunlight", "it produces glucose")
      if (l.endsWith("s") && !l.endsWith("ss") && (KNOWN_VERBS.has(l.slice(0, -1)) || KNOWN_VERBS.has(l.slice(0, -2)) || l === "absorbs" || l === "produces" || l === "makes")) {
        t.tag = "VBZ";
        continue;
      }

      // Plural subject + Base Verb VBP / VB (e.g., "plants make glucose", "leaves absorb light")
      if (prev && (prev.lower.endsWith("s") || prev.lower === "they" || prev.lower === "plants" || prev.lower === "leaves") && (KNOWN_VERBS.has(l) || l === "make" || l === "absorb")) {
        t.tag = "VBP";
        continue;
      }

      // Pass 3: Morphological and Lexicon Fallbacks
      const morph = morphologyTag(t.text);
      if (morph) {
        t.tag = morph;
        continue;
      }

      if (KNOWN_VERBS.has(l)) {
        t.tag = "VB";
        continue;
      }

      if (KNOWN_ADJECTIVES.has(l)) {
        t.tag = "JJ";
        continue;
      }

      if (INTENSIFIERS.has(l)) {
        t.tag = "RB";
        continue;
      }

      // Plural Noun check
      if (l.endsWith("s") && !l.endsWith("ss") && (KNOWN_NOUNS.has(getLemma(l)) || KNOWN_NOUNS.has(l.slice(0, -1)) || l === "leaves" || l === "plants" || l === "reactions" || l === "notes")) {
        t.tag = "NNS";
        continue;
      }

      // Capitalized Proper Noun check (mid-sentence)
      if (t.isCapitalized && i > 0) {
        t.tag = "NNP";
        continue;
      }

      // Default Noun
      t.tag = "NN";
    }
  }
}

// Analyze text and extract key terms with contextual POS tags
function analyzeText(rawText) {
  const sentences = tokenizeSentences(rawText);
  tagSentences(sentences);

  const counts = {};
  const tags = {};
  const untagged = new Set();

  for (const sent of sentences) {
    for (const t of sent.tokens) {
      const l = t.lower;
      if (STOP_WORDS.has(l) || TL_STOP.has(l) || l.length < 3 && !TL_WORDS.has(l)) {
        continue;
      }

      if (t.tag === "TL" || TL_WORDS.has(l) || TL_WORDS.has(stemTagalog(l))) {
        untagged.add(l);
        continue;
      }

      // Ignore pure function determiners or prepositions
      if (t.tag === "DT" || t.tag === "IN" || t.tag === "PRP" || t.tag === "CC" || t.tag === "TL_STOP") {
        continue;
      }

      // Term identifier
      const isProper = t.tag === "NNP";
      const key = isProper ? (t.isCapitalized ? t.text : t.text.charAt(0).toUpperCase() + t.text.slice(1)) : (t.tag.startsWith("NN") ? getLemma(l) : l);

      // Track surface / plural form as well for indexing & queries
      counts[key] = (counts[key] || 0) + 1;
      if (t.tag === "NNS") {
        tags[key] = "NNS";
        tags[l] = "NNS";
      } else if (!tags[key] || (tags[key] === "NN" && t.tag !== "NN")) {
        tags[key] = t.tag;
      }
      tags[l] = t.tag;
    }
  }

  const terms = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  return { terms, counts, tags, untagged: [...untagged] };
}

module.exports = {
  tokenizeSentences,
  tagSentences,
  analyzeText,
  getLemma,
  stemTagalog
};
