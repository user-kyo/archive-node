# ArchiveNode

**A Study Notes Structuring Engine: System Background and Scope**

## 1. Background

Students take notes in notebooks, on loose sheets, and in chat messages to themselves. The notes are informal: shortcuts, abbreviations, repeated letters, and run-on sentences. Before an exam, the problem is no longer writing the notes but finding and organizing what is in them. Photographing a page keeps a copy, but a photo cannot be searched, and rereading every page to find the key ideas is slow.

ArchiveNode is a web-based tool that turns raw study notes, either pasted as text or photographed from a handwritten page, into a clean, structured and searchable entry. It applies the natural language processing techniques from our course (tokenization, stopword filtering, lemmatization, WordNet, regular expressions, frequency analysis, and contextual POS tagging) to extract the key terms and recurring topics from each note. Because many Filipino students write in a mix of English and Tagalog, ArchiveNode includes a Taglish-tolerant layer so that mixed-language notes are cleaned and processed instead of breaking the pipeline.

## 2. Problem Statement

Existing note tools can store notes and make their words searchable, but the student still has to read the notes to find out what they are about. ArchiveNode addresses this gap: it automatically cleans informal note text and produces a structured summary of its key terms and main topics, so the student sees what a note covers before reading it.

## 3. Core Functionalities

The system is organized into a clean **frontend** (client application) and **backend** (NLP pipeline, REST API, SQLite database via Prisma) architecture, following the six core course functions:

| Function | What it does | Course topic |
| --- | --- | --- |
| **1. Note input** | The user pastes typed notes, snaps a photo using the device camera, or uploads a handwritten page. An interactive Google Lens-style scanner extracts text with word-level bounding boxes and sanitizes character clutter. | Chapter 1 (NLP lifecycle: data collection & OCR) |
| **2. Cleanup and normalization** | Expands contractions (`couldn't` → `could not`) and abbreviations (`pls` → `please`, `imp` → `important`), and collapses stretched words (`soooo` → `so`, `sooobrang` → `sobrang`) using regular expressions. Common Taglish shortcuts (`yun` → `yung`, `di` → `hindi`) and OCR character confusions are corrected automatically, with strict derivational morphology preservation protecting already-correct words (`importance`, `difference`). | Chapter 7 (word replacement, edit distance, and regex normalization) |
| **3. Sentence and word splitting** | Splits run-on notes into sentences and words. English and Tagalog stopwords are removed (using the NLTK stopword list plus a custom Tagalog function word list), while polarity negations such as "not" and "hindi" are preserved. | Chapters 3 and 4 (tokenizers, stopword filtering) |
| **4. Key term extraction & Contextual POS Tagging** | Reduces words to their dictionary root (lemmatization) and contextually tags parts of speech across grammatical classes (nouns `NN`/`NNS`, proper nouns `NNP`, base/conjugated verbs `VB`/`VBZ`/`VBP`/`VBD`, adjectives `JJ`, adverbs `RB`, modals `MD`, and Taglish words `TL`). Key concepts and entities are highlighted with color-coded badges. | Chapters 6 and 9 (lemmatization, Brill-style contextual POS tagging) |
| **5. Topic grouping & WordNet Lexicon** | Counts the most frequent terms (FreqDist) to surface recurring topics, and connects extracted terms to WordNet hypernym taxonomies (e.g., biological process, economic concept) with interactive multi-synset meaning navigation (`Meaning 1 of N`). | Chapters 2 and 5 (FreqDist, WordNet synsets & hypernyms) |
| **6. Review, save and search** | The raw note or photo is displayed side-by-side with the cleaned text. The user reviews extracted terms, browses synsets, edits or removes tags, and saves the note to a persistent local SQLite database searchable by keyword, title, or date. | Chapter 1 (structured output & persistence) |

**Output of one processed note:** the cleaned text, an autocorrection audit banner, a list of contextually-tagged key terms, WordNet hypernym categories, top topics with their frequencies, and the original image and raw text preserved intact.

## 4. Taglish-Tolerant Layer

This layer lets the pipeline handle notes that mix English and Tagalog without requiring full Tagalog language parsing. It operates across three stages:

- **Tagalog stopword filtering.** A custom list of common function words (e.g., "ang", "ng", "sa", "yung", "daw", "mga", "ko", "mo") is filtered during keyword extraction so they do not crowd the topic summaries.
- **Taglish normalization rules.** Regular expressions standardize informal shortcuts, spelling variants, and stretched words (e.g., "sooobrang" → "sobrang", "yun" → "yung", "di" → "hindi") before tokenization.
- **English-first extraction with Tagalog preservation.** POS tagging, WordNet lookups, and lemmatization are applied to English subject words. Tagalog content words (e.g., "mahalaga", "maintindihan", "hirap", "aralin") are preserved in the text and displayed with distinct `TL` badges and custom corpus definitions rather than being discarded or misclassified.

**Example:** `"Photosynthesis is soooo important daw sa exam!! yung chlorophyll sa leaves absorbs sunlight"` is cleaned to `"Photosynthesis is so important daw sa exam! yung chlorophyll sa leaves absorbs sunlight"`. Extracted terms include `photosynthesis` [NN], `important` [JJ], `exam` [NN], `chlorophyll` [NN], `leaves` [NNS], `absorbs` [VBZ], and `sunlight` [NN], with `"daw"` and `"yung"` filtered as stopwords.

## 5. Related Systems

Many tools already convert handwritten notes to text and make them searchable. The table below summarizes what they offer based on their public descriptions, and where ArchiveNode intentionally differs.

| System | What it offers | How ArchiveNode differs |
| --- | --- | --- |
| **Notewise, GoodNotes, Evernote, Apple Notes** | Full note-taking apps with handwriting or image OCR and search across notes. Some add AI chat and summaries. | ArchiveNode is not a generic note-taking app. It structures notes with transparent, explainable, rule-based NLP and extracts key concepts and hypernym topics. |
| **Handwriting-to-text and OCR apps (e.g., NoteOCR)** | Convert photos of notes into editable, searchable text, with annotation and text-to-speech. | They stop at raw text extraction. ArchiveNode continues beyond text conversion: OCR cleanup, contraction expansion, spell normalization, POS tagging, topic grouping, and database archiving. |
| **Open-source OCR tools (e.g., InkSpire)** | Convert scanned handwriting into searchable, editable text with export options. | ArchiveNode integrates a full NLP analysis pipeline and an interactive human review step on top of the extracted text. |

## 6. What Makes ArchiveNode Different

- **It structures notes instead of only storing them.** The result is an indexed set of key terms, grammatical roles, and categorical topics per note, not just searchable raw text.
- **It is explainable.** Every extracted term can be traced to a specific deterministic rule (a regex normalizer, a lemmatizer, a Brill-style syntactic rule, or a WordNet synset path), unlike opaque generative AI summaries.
- **It works on informal student text.** The normalization engine handles real student writing: informal abbreviations, repeated letters, contractions, and Taglish expressions.
- **It protects valid vocabulary.** Derivational morphology detection ensures already-correct academic words (e.g., `importance` vs. `important`, `difference` vs. `different`) are never corrupted.
- **It tolerates Taglish.** Mixed English and Tagalog notes are handled through a dedicated lightweight layer without claiming full Tagalog language processing.
- **The user stays in control.** Original photos and raw text are never overwritten, and tags can be inspected and edited before saving.

## 7. Scope and Limitations

**In scope:**
- English and Taglish study notes (partial Tagalog support, see Section 4).
- Pasted typed text, uploaded photos, and live device camera captures.
- Google Lens interactive OCR scanner with word-level bounding boxes and character cleaning.
- The six NLP pipeline functions described in Section 3.
- Persistent local SQLite database storage with CRUD and real-time search.

**Out of scope (to keep the system focused and lightweight):**
- Generative AI chat or LLM summaries.
- Audio recording or voice transcription.
- Drawing, sketching, or handwriting stylus canvases.
- Cloud synchronization, user accounts, and quiz generation.
- Full Tagalog POS taggers, parsers, and machine translation between English and Tagalog.

**Known limitations:**
- Handwriting recognition depends on lighting, camera focus, and pen contrast; low-confidence words are highlighted in amber for user review.
- Tagalog words are not mapped to WordNet synsets; they are preserved in the text and given Taglish corpus entries.
- The system is designed as a local study aid and does not replace commercial document scanners.
