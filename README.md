# ArchiveNode

**A Study Notes Structuring Engine**

ArchiveNode transforms raw, informal, handwritten, or pasted study notes into clean, searchable, and structured topic summaries using rule-based Natural Language Processing (NLP).

---

## 📁 System Architecture & Directory Structure

```
ArchiveNode/
├── frontend/                   # Client-side single-page application & assets
│   ├── index.html              # Responsive single-page application
│   └── models/                 # Local OCR trained model binaries
│       └── eng.traineddata     # Pre-warmed Tesseract OCR weights
│
├── backend/                    # Complete server backend, API, DB & tests
│   ├── config/
│   │   └── db.js               # PrismaClient database connection singleton
│   ├── data/
│   │   └── wordnet.js          # WordNet & Tagalog Lexical Knowledge Base
│   ├── nlp/
│   │   ├── ocrCleaner.js       # OCR character and symbol noise sanitizer
│   │   └── tagger.js           # Brill-style Contextual POS Tagger & NLP engine
│   ├── routes/
│   │   ├── notes.routes.js     # Notes CRUD endpoints (/api/notes)
│   │   ├── ocr.routes.js       # Google Lens / Camera OCR endpoint (/api/ocr)
│   │   └── wordnet.routes.js   # WordNet dictionary query endpoint (/api/wordnet/:word)
│   ├── services/
│   │   └── ocrService.js       # Tesseract.js worker pool & text extraction
│   ├── prisma/                 # Database schemas & migrations
│   │   ├── schema.prisma       # SQLite database schema
│   │   ├── dev.db              # Local SQLite database
│   │   └── seed.js             # Sample study notes seeder
│   ├── tests/                  # Automated test suites
│   │   ├── autocorrect.test.js # Autocorrect, stretching, contractions tests
│   │   ├── ocr.test.js         # OCR text sanitizing & character tests
│   │   ├── tagger.test.js      # Brill-style contextual POS tagger tests
│   │   └── verify_html.test.js # Frontend script validation tests
│   ├── app.js                  # Express app setup, CORS & static frontend serving
│   ├── server.js               # Server listener & network address discovery
│   ├── package.json            # Backend dependencies & npm scripts
│   ├── package-lock.json       # Locked dependency tree
│   ├── .env                    # Local environment configuration
│   └── node_modules/           # Installed packages
│
├── System_Background.md        # NLP course mapping and system background
├── tracker.md                  # Core functionality checklist and audit tracker
├── .gitignore                  # Git ignore rules for node_modules, logs, etc.
└── README.md                   # System architecture documentation
```

---

## 🌟 Key Features

1. **Google Lens & Camera Scanner OCR**:
   - Live camera snap or image upload with automatic contrast stretching and paper background clearing.
   - Word-level bounding boxes rendered over the original image with one-click copy and low-confidence word flagging.
   - Robust sanitization removes border lines, non-standard symbol clutter, and common OCR substitutions.

2. **Rule-Based Normalization & Autocorrection**:
   - Expands informal shortcuts (`pls` → `please`, `imp` → `important`, `bc` → `because`).
   - Expands English contractions (`couldn't` → `could not`, `it's` → `it is`, `you're` → `you are`).
   - Collapses repeated characters in stretched words (`soooo` → `so`, `sooobrang` → `sobrang`).
   - Corrects frequent typos while strictly preserving already-correct academic words (`importance`, `difference`) via derivational morphology protection.

3. **Context-Aware Part-of-Speech (POS) Tagging**:
   - Brill-style syntactic transformation rules tag words across all grammatical roles:
     - Nouns (`NN`), Plural Nouns (`NNS`), Proper Nouns / Named Entities (`NNP`)
     - Verbs (`VB`, `VBZ`, `VBP`, `VBD`, `VBG`, `VBN`)
     - Adjectives (`JJ`), Adverbs (`RB`), Modals (`MD`)
     - Taglish Vocabulary (`TL`)
   - Distinct color-coded visual badges in both review chips and detail note cards.

4. **Multi-Synset WordNet & Corpus Lexicon**:
   - Clean, distraction-free dictionary card with WordNet hypernym pathways (e.g. `cellular biology → basic unit of life`).
   - Interactive synset pager (`Meaning 1 of N`) with **`‹ Prev`** and **`Next Meaning ›`** buttons.
   - Frequency counts showing occurrences within the current note (`FreqDist: Nx in note`).
   - In-memory caching for zero-latency chip lookups.

5. **Local Persistence & Search**:
   - Full CRUD operations backed by local SQLite via Prisma ORM.
   - Real-time search filtering across titles, keywords, text, and dates with pre-computed indexing.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
cd backend
npm start
```
Or with auto-reload during development:
```bash
cd backend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run Automated Tests
```bash
cd backend
npm test
```

### 4. Database Management
From inside the `backend` folder:
- **Open Prisma Studio:** `npm run prisma:studio`
- **Re-seed Initial Notes:** `npm run db:seed`
- **Sync Database Schema:** `npm run prisma:push`

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3 (GPU-accelerated, dark/light themes), ES6 JavaScript |
| **Backend** | Node.js, Express 5, CORS |
| **NLP & OCR** | Tesseract.js (local traineddata), Custom Rule-Based Engine (Regex, Lemmatizer, Brill-style POS, FreqDist, WordNet synset mapper) |
| **Database** | SQLite, Prisma ORM |
| **Testing** | Node.js Test Suite (`backend/tests/`) |
