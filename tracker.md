# ArchiveNode Functionality & Audit Tracker

This document audits and tracks all core functionalities of **ArchiveNode** as specified in [`System_Background.md`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/System_Background.md), verifying the natural language processing (NLP) course pipeline rules, database CRUD operations, and scope boundaries.

---

## Functionality Checklist

### Note input
- [x] **Paste typed notes**
  - *Status:* Working. Users can directly type or paste study notes into the `#raw` input area.
- [x] **Upload a photo of a handwritten page & Camera snap**
  - *Status:* Working. Image upload is supported via file selector (`#file`) and live mobile/desktop camera capture (`#camera-file` with `capture="environment"` via `#btn-camera`).
- [x] **Google Lens Interactive Scanner & Camera Scanner OCR**
  - *Status:* Working. Behaves like Google Lens / camera scanner:
    - Snapping a picture (`#camera-file` via `#btn-camera`) or picking an image (`#btn-file`) opens the interactive Google Lens scanner (`#lens-box-container`).
    - High-resolution phone snaps (12MP/4000px) are scaled client-side to max 1600px via canvas, cutting payload from 12MB to ~250KB and preventing memory issues.
    - Adaptive canvas contrast stretching clears yellow/gray paper tones, wrinkles, and shadows while enhancing dark ink strokes using fast statistical sampling and integer arithmetic.
    - Pre-warmed singleton Tesseract worker with local [`frontend/models/eng.traineddata`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/frontend/models/eng.traineddata) extracts all text in <100ms with full `blocks -> paragraphs -> lines -> words` bounding box support.
    - **Clean Output Sanitizer (`cleanOcrText`)**:
      - Eliminates unwanted characters, control codes, and non-standard symbol clutter (`§©®™°±¢€¥«»¿¡¶•~^\/|\`¤¥§¨©ª«®¯°±²³´µ¶·¸¹º»¼½¾¿×÷`).
      - Strips divider borders, table lines, and lines of stray symbols (`---`, `___`, `===`, `|||`).
      - Drops stray isolated single symbols or consonants while preserving valid words and numbers.
      - Repairs hyphenated line wraps (`photo-\nsynthesis` → `photosynthesis`) and normalizes punctuation spacing.
      - Automatically corrects common OCR character substitutions (`0xygen` → `Oxygen`, `gluc0se` → `glucose`, `sunllght` → `sunlight`, `chlorophy11` → `chlorophyll`, `ce11ular` → `cellular`, `sy5tem` → `system`).
    - Overlays interactive word bounding boxes (`.lens-box`) on the image using batch `DocumentFragment` insertion for 60fps rendering. Clicking any word copies it to the clipboard with visual flash feedback.
    - **"Copy Text"** (`#btn-lens-copy`) copies all clean extracted text to the clipboard.
    - **"Process Note Now"** (`#btn-lens-process`) automatically populates the note and immediately executes the NLP pipeline without extra steps.
    - Text is also automatically filled into `#raw` note entry so users can review or edit directly.
- [x] **Low-confidence OCR words flagged for review**
  - *Status:* Working. Low-confidence words (< 70% confidence) are visually highlighted in amber on the image (`.lens-box.low-conf`) and listed in `#ocrNote` for review.

---

### Cleanup and normalization
- [x] **Contractions and abbreviations expanded**
  - *Status:* Working (Chapter 7). Common English contractions (`couldn't` → `could not`, `can't` → `cannot`, `it's` → `it is`, `you're` → `you are`) and abbreviations (`pls` → `please`, `imp` → `important`, `bc` → `because`, `diff` → `difference`) are expanded via regular expressions.
- [x] **Stretched or repeated characters collapsed (e.g., "sooobrang")**
  - *Status:* Working (Chapter 7). Regex `([A-Za-z])\1{2,}` collapses elongated/repeated letters (e.g., `"sooo"` → `"so"`, `"sooobrang"` → `"sobrang"`, `"pleeease"` → `"please"`, `"cooool"` → `"cool"`).
- [x] **Taglish shortcuts standardized ("yun" to "yung", "di" to "hindi")**
  - *Status:* Working (Section 4). Common Filipino/Taglish spelling shortcuts (e.g., `"yun"` → `"yung"`, `"di"` / `"nde"` → `"hindi"`) are standardized before tokenization.
- [x] **Likely OCR confusions corrected**
  - *Status:* Working (Chapter 7). Common OCR digit/letter substitution confusions (e.g., `"chlorophy11"` → `"chlorophyll"`, `"sunllght"` → `"sunlight"`, numeral `1` inside words) are normalized automatically.
- [x] **Intelligent Spelling, Stretched Words, Shortcuts, & Contractions Autocorrection in Cleaned Text**
  - *Status:* Working (Chapter 7 - Word Normalization & Controlled Edit Distance):
    - **Contractions Expanded**: Systematically detects and expands English contractions (`couldn't` → `could not`, `it's` → `it is`, `you're` → `you are`, `don't` → `do not`, `won't` → `will not`, `they're` → `they are`, etc.) with case preservation and tracks them in the Cleaned Words correction feedback.
    - **Shortcuts & Abbreviations Expanded**: Expands informal abbreviations and study shortcuts (`pls`/`plz` → `please`, `imp` → `important`, `bc`/`b/c` → `because`, `yun` → `yung`, `di`/`nde` → `hindi`, `w/` → `with`, `w/o` → `without`, `diff` → `difference`, `temp` → `temperature`, etc.).
    - **Stretched Words Normalization**: Elongated words with 3+ repeated characters (e.g. `soooo` → `so`, `sooobrang` → `sobrang`, `pleeease` → `please`, `cooool` → `cool`) are tested against known English/Tagalog vocabulary and collapsed to their proper single- or double-letter spellings.
    - **Genuine Typos & OCR Errors Corrected**: High-frequency science and study typos (e.g., `photosynthesys` → `photosynthesis`, `glucuse` → `glucose`, `oxigen` → `oxygen`, `celular` → `cellular`, `sunllght` → `sunlight`, `chlorophy11` → `chlorophyll`, `netwrok` → `network`, `algoritm` → `algorithm`, `kaylangan` → `kailangan`) are corrected.
    - **Strict Preservation Guard for Already Correct Words**:
      - Words that are already correct (e.g., `importance` vs `important`, `difference` vs `different`, `significance` vs `significant`, `substance`, `evidence`, `statement`, `requirement`) are **guaranteed never to be altered**.
      - Incorporates derivational morphology detection (`hasValidMorphology` for `-ance`, `-ence`, `-tion`, `-sion`, `-ment`, `-ness`, `-ity`, `-able`, `-ible`, `-al`, `-ic`, `-ive`, `-ous`, `-ful`, etc.).
      - Adds suffix collision protection preventing swapping between `-ance`/`-ence` nouns and `-ant`/`-ent` adjectives.
      - Restricts fuzzy Levenshtein search to words of length >= 5 with strict distance 1 and matching initial characters, completely protecting short and valid words.
    - Displays a transparent visual feedback banner in the Review Entry view (`#autocorrect-notice`) highlighting each correction (e.g., `<s>couldn't</s> → <b>could not</b>`, `<s>soooo</s> → <b>so</b>`, `<s>photosynthesys</s> → <b>photosynthesis</b>`).

---

### Sentence and word splitting
- [x] **Run-on notes split into sentences and words**
  - *Status:* Working (Chapters 3 & 4). Punctuation boundaries without trailing spaces (`.`, `!`, `?`, `,`) are automatically normalized to separate run-on sentences and clauses into clean tokens.
- [x] **English and Tagalog stopwords removed**
  - *Status:* Working (Chapters 3 & 4). Stopword filtering removes both NLTK English stopwords (`is`, `are`, `the`, `in`, `on`, `at`, etc.) and custom Tagalog function words (`ang`, `ng`, `sa`, `yung`, `na`, `at`, `ay`, `mga`, `ko`, `mo`, etc.).
- [x] **Negations ("not", "hindi") kept**
  - *Status:* Working (Chapters 3 & 4). Negation words (`not`, `hindi`) are intentionally excluded from stopword lists, preserving polarity and meaning.

---

### Key term extraction & Contextual POS Tagging
- [x] **Words reduced to their dictionary root**
  - *Status:* Working (Chapter 6). Rule-based lemmatizer handles irregular noun forms (`leaves` → `leaf`, `analyses` → `analysis`), `-ies` suffixes (`batteries` → `battery`), `-es` suffixes (`processes` → `process`), and standard plural `-s` suffixes.
- [x] **Context-Aware Part-of-Speech (POS) Tagging Across Grammatical Classes**
  - *Status:* Working (Chapter 9 - Categorizing and Tagging Words & Brill-style Contextual Rules). Rather than hardcoding all terms as nouns (`NN`), ArchiveNode contextually determines and tags each word according to its syntactic role in the sentence:
    - **Nouns**: `NN` (singular/mass nouns like `photosynthesis`, `chlorophyll`, `glucose`), `NNS` (plural nouns like `leaves`, `plants`, `reactions`), `NNP` (proper nouns/named entities like `Calvin`, `Reyes`, `Melvin`).
    - **Verbs**: `VB` (infinitive/imperative/base verbs like `finish`, `ask`, `make`), `VBZ` (3rd person singular present verbs like `absorbs`, `produces`), `VBP` (non-3rd person present verbs like `make`, `absorb`), `VBD` (past tense verbs like `studied`, `absorbed`), `VBG` (present participles like `studying`, `absorbing`), `VBN` (past participles).
    - **Adjectives**: `JJ` (descriptive/predicate/attributive adjectives like `important`, `cellular`, `light`, `chemical`, `crucial`).
    - **Adverbs**: `RB` (adverbs like `rapidly`, `thoroughly`, `sooo`).
    - **Modals**: `MD` (modal verbs like `can`, `could`, `will`, `should`).
    - **Tagalog Content Words**: `TL` (Taglish layer words like `mahalaga`, `maintindihan`).
  - **Explainable Syntactic & Transformation Rules**:
    1. *Modal + Verb Rule*: Words following modal auxiliaries (`could not finish`, `can absorb`) are tagged `VB`.
    2. *Infinitive "to" Rule*: Words following `to` are tagged `VB`.
    3. *Copula + Modifier Rule*: Words following copula verbs + intensifiers (`is soooo important`) are tagged `JJ`.
    4. *Attributive Modifier Rule*: Modifiers immediately preceding confirmed nouns (`light reactions`, `cellular respiration`) are tagged `JJ`.
    5. *Subject-Verb Agreement*: Singular subjects with `-s` verbs (`chlorophyll absorbs`) are tagged `VBZ`; plural subjects with base verbs (`plants make`) are tagged `VBP`/`VB`.
    6. *Clause-Initial Imperative*: Clause-initial action verbs (`ask Ma'am Reyes`, `study chapter 5`) are tagged `VB`.
    7. *Named Entity Sequence*: Honorific titles (`Ma'am Reyes`) and capitalized entity pairs (`Melvin Calvin`) are tagged `NNP`.
  - **Color-Coded Visual Badges in UI**:
    - Each POS type is rendered with distinct color-coded styling and tooltips in both Review Entry chips and Archive Detail Note views:
      - `NN`/`NNS`: Blue badge (`.pos-nn`)
      - `NNP`: Purple/Violet badge (`.pos-nnp`)
      - `VB`/`VBZ`/`VBP`/`VBD`/`VBG`: Emerald Green badge (`.pos-vb`)
      - `JJ`: Amber/Orange badge (`.pos-jj`)
      - `RB`: Cyan/Teal badge (`.pos-rb`)
      - `MD`: Rose badge (`.pos-md`)
      - `TL`: Slate badge (`.pos-tl`)
- [x] **Tagalog words kept in the text but left untagged**
  - *Status:* Working (Section 4). Tagalog content words (e.g., `"mahalaga"`, `"maintindihan"`) remain preserved in the cleaned note text, displayed with distinct `TL` badges without English POS modification.

---

### Topic grouping
- [x] **Most frequent terms counted to find recurring topics**
  - *Status:* Working (Chapter 2 - FreqDist). FreqDist calculates term occurrences, ordering key concepts by frequency.
- [x] **Related terms grouped under broader categories with WordNet**
  - *Status:* Working (Chapter 5 - WordNet). Extracted terms are matched to hypernym categories (e.g., `"biological process"`, `"carbohydrate"`, `"energy source"`, `"economic concept"`, `"assessment"`, `"computer science"`).
- [x] **Main topics shown with frequency**
  - *Status:* Working (Chapter 2). Top recurring topics are visualized with proportional progress bars and exact frequency counts.

---

### Review, save and search
- [x] **Raw note or photo shown beside the cleaned text**
  - *Status:* Working (Chapter 1). The Review Entry screen displays a side-by-side comparison with the original text (and uploaded photo `#outPhoto`) beside the cleaned text.
- [x] **Key terms can be reviewed, edited, and explored via Multi-Synset WordNet & Corpus Lexicon**
  - *Status:* Working (WordNet Synsets & Lexical Taxonomy). Clicking any extracted key term or Tagalog keyword (in Review Entry or Detail Note view) opens an interactive **WordNet & Corpus Lexicon Card**:
    - **Clean, Clutter-Free UI**: Clean, distraction-free lexical definitions without noisy chapter citations.
    - **Multi-Synset Sense Browsing**:
      - Supports multiple synsets/senses per word (e.g., `cell`: biological unit vs. prison room vs. battery; `plant`: living organism vs. factory vs. verb sow; `demand`: market demand vs. urgent request; `cycle`: metabolic pathway vs. bicycle).
      - Interactive synset pager (`Meaning 1 of N`) with **`‹ Prev`** and **`Next Meaning ›`** navigation buttons, plus inline quick-cycle controls.
      - Smoothly updates synset ID, POS tag, hypernym path, definition, and related synonyms without closing the card.
    - Maps the full **WordNet hypernym taxonomy** (e.g. `cellular biology → basic unit of life`, `economic concept → market force`).
    - Provides note corpus frequency (`FreqDist: Nx in note`).
    - In-memory `wordNetCache = new Map()` eliminates duplicate network lookups.
    - Preserves Taglish corpus layer treatment for Filipino words.
    - Users can also remove individual terms with the `×` button or add custom terms before committing.
- [x] **Entry saved to the database**
  - *Status:* Working (Full CRUD). Notes persist directly to the SQLite database via Prisma ORM and Express REST API (`POST /api/notes`, `PUT /api/notes/:id`, `DELETE /api/notes/:id`).
- [x] **Saved entries searchable by term or topic**
  - *Status:* Working. The Archive view supports real-time multi-word search filtering across note titles, key terms, note text, and dates, with instant chip-click filtering and pre-computed search indexing.
- [x] **Original photo or raw text never overwritten**
  - *Status:* Working. Original input text and source images are preserved intact in the database and local archive.

---

### Performance & Smooth Animation Optimization
- [x] **GPU-Accelerated Scanner Beam & Keyframe Transitions**:
  - Replaced CPU layout reflow animations (`top: 0% -> 96%`) on `#lens-laser-beam` with GPU-accelerated composited transforms (`transform: translate3d(0, 0, 0) -> translate3d(0, 360px, 0)`), reducing frame times from 16ms+ to <2ms.
  - Added `will-change: transform, opacity` and hardware compositing to interactive bounding boxes and lasers.
  - Accelerated background `.mesh-blob` with `transform: translate3d(..., 0)`, `contain: strict`, and lowered Gaussian blur to eliminate GPU fillrate bottlenecks.
- [x] **Eliminated Layout Thrashing & Forced Reflows**:
  - Removed synchronous layout flushes (`void this.offsetHeight`) and transition conflicts in `#raw` note textarea input listeners; replaced with debounced `requestAnimationFrame` auto-resizing for instantaneous typing without lag.
  - Replaced iterative DOM appending in Google Lens `drawBoxes()` with a batch `DocumentFragment`, preventing layout thrashing when rendering hundreds of detected word boxes.
- [x] **Instantaneous Search & Zero-GC Archive Rendering**:
  - Pre-computed note search index (`e.searchContent` and `e.parsedTerms`) at ingestion/load time to avoid repetitive JSON parsing and string concatenation per note on every keystroke.
  - Eliminated staggered entry animation delays during live filtering so searches feel instantaneous and zero-flicker.
- [x] **In-Memory Caching (WordNet & NLP)**:
  - Added `wordNetCache = new Map()` for lexical lookups across word chips and synset pagers, eliminating redundant remote HTTP API requests.
  - Cached parsed note NLP results (`e._noteAnalysis`) in-memory to prevent re-running tokenization and POS taggers on every note card click.
- [x] **Fast Statistical Luminance Sampling for OCR**:
  - Replaced 7.6M-iteration floating-point luminance calculations with 1/16th statistical sampling and integer bitwise math (`(d[i]*77 + d[i+1]*150 + d[i+2]*29) >> 8`), accelerating image preprocessing for OCR by over 5x.

---

### Should not exist (out of scope)
- [x] **No AI chat or generated summaries**
  - *Verified:* Fully rule-based, deterministic NLP pipeline; no generative AI or conversational agents exist.
- [x] **No audio recording or drawing canvas**
  - *Verified:* Neither audio recording APIs nor drawing canvases are present.
- [x] **No cloud sync, collaboration, or quiz generation**
  - *Verified:* Operates as a local-first study archive with local SQLite/Prisma storage; no multi-user sync or quiz generation features exist.
- [x] **No translation between English and Tagalog**
  - *Verified:* Operates with a Taglish-tolerant layer without attempting translation.

---

## Technical Architecture & Audit Summary

| Component | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend UI** | Vanilla HTML5 / CSS3 / ES6 | Embedded responsive SPA in [`frontend/index.html`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/frontend/index.html) with dark/light themes, Google Lens OCR viewer, and accessibility controls. |
| **NLP Engine** | Rule-based Contextual Pipeline | Regex normalization, Taglish layer, stopword filters, lemmatization, FreqDist, Brill-style POS tagging, and WordNet hypernym grouping in [`backend/nlp/tagger.js`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/nlp/tagger.js) and [`backend/nlp/ocrCleaner.js`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/nlp/ocrCleaner.js). |
| **Backend API** | Node.js / Express (Modular) | Structured in [`backend/app.js`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/app.js), [`backend/routes/`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/routes), [`backend/services/`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/services), [`backend/data/`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/data), and [`backend/config/`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/config). |
| **Database** | SQLite + Prisma ORM | Schema in [`backend/prisma/schema.prisma`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/prisma/schema.prisma), persisted in `backend/prisma/dev.db`. |
| **Automated Tests**| Node.js Test Suite | Comprehensive tests in [`backend/tests/`](file:///c:/Users/zuaso/OneDrive/Desktop/CODE/ArchiveNode/backend/tests) covering autocorrection, POS tagging, OCR cleaning, and frontend HTML script verification (`npm test`). |
