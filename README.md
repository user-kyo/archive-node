# ArchiveNode 📝

ArchiveNode is a smart study notes app that helps students clean up, organize, and search their notes. Whether you type notes in directly or snap a photo of a handwritten page, ArchiveNode fixes typos, extracts key concepts, and gives you instant dictionary definitions.

---

## ✨ Features

- **Photo & Camera Scanner**: Snap a page with your webcam or phone camera, or upload an image to extract text automatically.
- **Automatic Text Cleanup**: Expands shortcuts (`pls` → `please`), fixes stretched words (`soooo` → `so`), and corrects typos.
- **Taglish Support**: Cleans notes written in a mix of English and Tagalog without losing important Filipino words.
- **Keyword & Grammar Tags**: Automatically labels key terms (nouns, action words, describing words, and Tagalog terms) with color-coded tags.
- **Built-in Dictionary**: Click any extracted keyword to see definitions and meanings right inside the app.
- **Related Notes**: Automatically finds other notes in your collection that share the same topic.
- **Fast Search**: Search all your saved notes by title, keyword, text, or date.
- **Private & Offline**: Runs entirely on your local machine—no accounts, no subscriptions, and no cloud uploads required.
- **Dark & Light Mode**: Easily switch themes depending on your preference.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- Python 3 (for the WordNet dictionary service)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start the App
```bash
npm start
```

*Or with automatic reload for development:*
```bash
npm run dev
```

Open your browser and go to:
👉 **http://localhost:3000**

---

## 🧪 Running Tests

To run the automated tests:
```bash
cd backend
npm test
```

---

## 📂 Project Structure

```
ArchiveNode/
├── frontend/             # User interface (HTML, CSS, JavaScript)
│   ├── index.html        # Main application page
│   ├── css/              # App styling & dark/light themes
│   └── js/               # Client-side scripts
│
├── backend/              # Node.js Express server & database
│   ├── nlp/              # Text cleanup, spellcheck & word tagging
│   ├── routes/           # API routes (notes, OCR, dictionary)
│   ├── prisma/           # SQLite database schema & seed data
│   └── tests/            # Test suites
│
├── System_Background.md  # Detailed overview & design rationale
├── tracker.md            # Feature tracker & checklist
└── README.md             # Project documentation
```

---

## 🧰 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite with Prisma ORM
- **Text & OCR**: Tesseract.js, Python NLTK WordNet
