# ArchiveNode Project Tracker

A clear, checklist-based tracker for all features, text processing, and system capabilities in ArchiveNode.

**Overall Status:** ✅ Core Features Complete & Verified  
**Last Updated:** October 2026

---

## 📋 Feature Checklist

### 1. Note Input & Camera Scanner
- [x] **Type or paste notes** — Directly enter study notes into the text area.
- [x] **Upload an image** — Select an existing photo or screenshot from your device.
- [x] **Camera snapshot** — Take a live photo of a notebook page using your phone or webcam.
- [x] **Interactive scanner (OCR)** — Automatically extracts handwritten/printed text from photos.
- [x] **Click-to-copy scanned words** — Tap any word box on the scanned image to copy it.
- [x] **Review unsure words** — Words with lower scan confidence (< 70%) are highlighted in yellow for quick review.
- [x] **Instant note transfer** — Send scanned text straight to the note editor with one click.

### 2. Text Cleanup & Autocorrect
- [x] **Expand contractions** — Changes shortcuts to full words (`can't` → `cannot`, `it's` → `it is`, `you're` → `you are`).
- [x] **Collapse stretched words** — Normalizes elongated words (`soooo` → `so`, `pleeease` → `please`, `cooool` → `cool`).
- [x] **Standardize chat shortcuts** — Converts informal study slang (`pls` → `please`, `bc` → `because`, `imp` → `important`, `diff` → `difference`).
- [x] **Taglish shortcut cleanup** — Fixes Filipino shortcuts (`yun` → `yung`, `di` → `hindi`).
- [x] **Fix scan & spelling errors** — Corrects common typos (`photosynthesys` → `photosynthesis`, `glucuse` → `glucose`, `sunllght` → `sunlight`).
- [x] **Protect correct words** — Real academic words (`importance`, `difference`, `evidence`) are never mistakenly altered.
- [x] **Before/After change log** — Shows a clear summary of all automatic corrections made to your text.

### 3. Language & Grammar Analysis
- [x] **Sentence & word splitting** — Breaks run-on sentences into clean readable statements.
- [x] **Remove filler words** — Filters out common English and Tagalog stop words (`the`, `is`, `at`, `ang`, `mga`) to focus on important content.
- [x] **Keep negation words** — Preserves meaning by keeping words like `not`, `no`, `hindi`, and `wala`.
- [x] **Word root detection** — Groups plurals and word variants to their base dictionary forms (`leaves` → `leaf`, `processes` → `process`).
- [x] **Color-coded grammar tags** — Automatically labels parts of speech with colored badges:
  - 🔵 **Nouns** (`NN`, `NNS`, `NNP`) — e.g., *photosynthesis, chlorophyll, Calvin*
  - 🟢 **Verbs** (`VB`, `VBZ`, `VBD`) — e.g., *absorbs, studied, make*
  - 🟡 **Adjectives** (`JJ`) — e.g., *cellular, important, light*
  - ⚪ **Tagalog words** (`TL`) — preserved and marked distinctly
- [x] **Topic frequency count** — Counts how often key concepts appear to highlight main topics.

### 4. Dictionary & Vocabulary (WordNet)
- [x] **Clickable keyword dictionary** — Clicking any keyword tag opens an in-depth dictionary card.
- [x] **Real WordNet definitions** — Displays accurate, dictionary-grade definitions powered by the NLTK WordNet corpus.
- [x] **Multiple meanings (Synset navigation)** — Browse through all definitions of words with multiple senses (e.g., `cell` in biology vs. battery) using `‹ Prev` and `Next Meaning ›`.
- [x] **Synonyms & topic categories** — Shows related synonyms and broad topic categories (hypernyms).
- [x] **Fast response cache** — Previously looked up words open instantly with zero lag.

### 5. Note Management & Search
- [x] **Side-by-side review** — Compare your original raw text/photo next to the cleaned study notes before saving.
- [x] **Add/remove keywords** — Manually add new keywords or remove irrelevant ones before saving.
- [x] **Local database storage** — Notes are saved safely in a local SQLite database using Prisma.
- [x] **Edit existing notes** — Modify titles, text, and keywords of saved notes at any time.
- [x] **Delete with confirmation** — A warning modal displays the note title and asks for confirmation before permanently deleting.
- [x] **Instant search** — Filter notes in real time by title, keyword, body text, or date.
- [x] **Related Notes** — Automatically discovers other notes that share topics and allows 1-click navigation between them.
- [x] **No self-relation bug** — A note is never listed as related to itself.

### 6. User Experience & Design
- [x] **Dark / Light theme** — One-click toggle that remembers your preference.
- [x] **Smooth animations** — Polished transitions when opening dictionary cards, switching senses, and navigating notes.
- [x] **Keyboard shortcuts**:
  - `Ctrl + S` / `Cmd + S` — Process note or review entry
  - `Esc` — Close dictionary popups, delete confirmation modal, or clear search
  - `Arrow Left` / `Arrow Right` — Browse through dictionary word meanings
- [x] **Mobile responsive layout** — Works on desktop, tablets, and phones with touch swipe support.

---

## 🚫 Out of Scope (Intentional Design Limits)

These items are deliberately kept out of scope to maintain simplicity, speed, and privacy:
- [x] **No Generative AI / Chatbots** — Purely rule-based and deterministic processing; no hallucinations.
- [x] **No Cloud Sync / Accounts** — Fully local and private; your notes stay on your machine.
- [x] **No Flashcards / Quiz generators** — Focuses exclusively on study note structuring, cleaning, and dictionary lookup.
- [x] **No Audio recording** — Purely text and photo-based note taking.
- [x] **No Language translation** — Supports English and Taglish as entered without forced translation.

---

## 🧪 Verification & Health
- [x] **Automated Test Suite**: Passes 100% of automated tests (`autocorrect`, `tagger`, `ocr`, `verify_html`, `api`).
- [x] **Server Health Monitoring**: Backend includes a `/api/health` endpoint monitoring database connectivity and Python WordNet status.
