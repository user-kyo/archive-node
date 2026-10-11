const { spawn, execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCRIPT_PATH = path.join(__dirname, '..', 'nlp', 'nltk_wordnet.py');
const STOPWORDS_PATH = path.join(__dirname, '..', 'data', 'nltk_stopwords.json');
const NAMES_PATH = path.join(__dirname, '..', 'data', 'nltk_names.json');

// In-memory cache for ultra-fast repeated queries
const wordnetCache = new Map();
let namesSet = null;
let stopwordsSet = null;

// Load NLTK exported sets if present
try {
  if (fs.existsSync(NAMES_PATH)) {
    const rawNames = JSON.parse(fs.readFileSync(NAMES_PATH, 'utf-8'));
    namesSet = new Set(rawNames.map(n => n.toLowerCase()));
  }
} catch (e) {
  namesSet = new Set();
}

try {
  if (fs.existsSync(STOPWORDS_PATH)) {
    const rawStop = JSON.parse(fs.readFileSync(STOPWORDS_PATH, 'utf-8'));
    stopwordsSet = new Set(rawStop.map(s => s.toLowerCase()));
  }
} catch (e) {
  stopwordsSet = new Set();
}

// Persistent Python Daemon Process
let pyProcess = null;
let pendingQueue = [];
let readyWaiters = [];
let isDaemonReady = false;

function getPythonBin() {
  if (process.env.PYTHON_BIN) return process.env.PYTHON_BIN;
  return process.platform === 'win32' ? 'py' : 'python3';
}

function startDaemon() {
  try {
    const pyBin = getPythonBin();
    pyProcess = spawn(pyBin, ['-u', SCRIPT_PATH, '--daemon'], {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let buffer = '';

    pyProcess.stdout.on('data', (chunk) => {
      buffer += chunk.toString('utf-8');
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep partial line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed.status === 'ready') {
            isDaemonReady = true;
            while (readyWaiters.length > 0) {
              const waiter = readyWaiters.shift();
              waiter();
            }
            continue;
          }
          if (pendingQueue.length > 0) {
            const { resolve, timer } = pendingQueue.shift();
            clearTimeout(timer);
            resolve(parsed);
          }
        } catch (err) {
          console.warn('[NLTK Daemon] JSON parse error:', err.message, trimmed);
          if (pendingQueue.length > 0) {
            const { reject, timer } = pendingQueue.shift();
            clearTimeout(timer);
            reject(err);
          }
        }
      }
    });

    pyProcess.stderr.on('data', (err) => {
      // debug logging if needed
    });

    pyProcess.on('close', () => {
      isDaemonReady = false;
      pyProcess = null;
      while (pendingQueue.length > 0) {
        const { reject, timer } = pendingQueue.shift();
        clearTimeout(timer);
        reject(new Error('NLTK daemon terminated'));
      }
      setTimeout(startDaemon, 3000);
    });

    pyProcess.on('error', () => {
      isDaemonReady = false;
      pyProcess = null;
    });
  } catch (err) {
    console.warn('[NLTK Daemon] Spawn failed, using CLI fallback:', err.message);
  }
}

// Start daemon
startDaemon();

function waitForReady(timeoutMs = 8000) {
  if (isDaemonReady) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      const idx = readyWaiters.indexOf(done);
      if (idx !== -1) readyWaiters.splice(idx, 1);
      resolve();
    }, timeoutMs);

    function done() {
      clearTimeout(timer);
      resolve();
    }
    readyWaiters.push(done);
  });
}

function queryDaemon(payload, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    if (!pyProcess) {
      return reject(new Error('Daemon not spawned'));
    }

    const timer = setTimeout(() => {
      const idx = pendingQueue.findIndex(p => p.timer === timer);
      if (idx !== -1) {
        pendingQueue.splice(idx, 1);
        reject(new Error('NLTK daemon query timeout'));
      }
    }, timeoutMs);

    pendingQueue.push({ resolve, reject, timer });
    try {
      pyProcess.stdin.write(JSON.stringify(payload) + '\n');
    } catch (writeErr) {
      clearTimeout(timer);
      const idx = pendingQueue.findIndex(p => p.timer === timer);
      if (idx !== -1) pendingQueue.splice(idx, 1);
      reject(writeErr);
    }
  });
}

function queryCliFallback(word) {
  return new Promise((resolve) => {
    execFile(getPythonBin(), [SCRIPT_PATH, word], { encoding: 'utf-8', timeout: 8000 }, (error, stdout) => {
      if (error || !stdout) {
        return resolve(null);
      }
      try {
        const data = JSON.parse(stdout.trim());
        if (data && !data.error) {
          resolve(data);
        } else {
          resolve(null);
        }
      } catch (_) {
        resolve(null);
      }
    });
  });
}

// Tagalog / Filipino corpus dictionary for the course Taglish layer
const TL_CORPUS = {
  mahalaga: {
    lemma: "mahalaga",
    synsets: [{
      synset: "mahalaga.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino adjective meaning 'important', 'crucial', or 'valuable'.",
      synonyms: ["important", "crucial", "essential", "valuable"]
    }]
  },
  maintindihan: {
    lemma: "intindi",
    synsets: [{
      synset: "maintindihan.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino verb meaning 'to understand' or 'to comprehend thoroughly'.",
      synonyms: ["understand", "comprehend", "grasp"]
    }]
  },
  hirap: {
    lemma: "hirap",
    synsets: [{
      synset: "hirap.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino noun/adjective describing difficulty, struggle, or hardship in comprehension.",
      synonyms: ["difficult", "hard", "struggle"]
    }]
  },
  kailangan: {
    lemma: "kailangan",
    synsets: [{
      synset: "kailangan.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino modal/word meaning 'need' or 'necessary'.",
      synonyms: ["necessary", "required", "need"]
    }]
  },
  aralin: {
    lemma: "aral",
    synsets: [{
      synset: "aralin.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino noun meaning 'lesson', 'subject matter', or 'topic to study'.",
      synonyms: ["lesson", "study topic", "curriculum"]
    }]
  },
  gawin: {
    lemma: "gawa",
    synsets: [{
      synset: "gawin.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino verb meaning 'to do' or 'to perform/make'.",
      synonyms: ["do", "perform", "make"]
    }]
  },
  tandaan: {
    lemma: "tanda",
    synsets: [{
      synset: "tandaan.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino verb meaning 'to remember' or 'to keep in mind'.",
      synonyms: ["remember", "memorize", "note"]
    }]
  },
  basahin: {
    lemma: "basa",
    synsets: [{
      synset: "basahin.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino verb meaning 'to read'.",
      synonyms: ["read", "review"]
    }]
  },
  sulat: {
    lemma: "sulat",
    synsets: [{
      synset: "sulat.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino noun/verb meaning 'writing', 'letter', or 'to write'.",
      synonyms: ["write", "letter", "note"]
    }]
  },
  sagot: {
    lemma: "sagot",
    synsets: [{
      synset: "sagot.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino noun/verb meaning 'answer', 'reply', or 'solution'.",
      synonyms: ["answer", "response", "solution"]
    }]
  },
  tanong: {
    lemma: "tanong",
    synsets: [{
      synset: "tanong.tl.01",
      pos: "tl. (Tagalog)",
      hypernym: "Filipino / Tagalog Vocabulary",
      definition: "Filipino noun meaning 'question' or 'inquiry'.",
      synonyms: ["question", "inquiry"]
    }]
  }
};

async function getWordNet(word) {
  if (!word) return null;
  const clean = word.toLowerCase().trim();

  // 1. In-memory cache check (instant <0.1ms)
  if (wordnetCache.has(clean)) {
    return wordnetCache.get(clean);
  }

  // 2. Wait for daemon to become ready if still spinning up
  await waitForReady();

  // 3. Query Python NLTK WordNet Daemon (instant ~1-2ms)
  if (isDaemonReady) {
    try {
      const resp = await queryDaemon({ cmd: 'wordnet', word: clean });
      if (resp && resp.success && resp.data) {
        wordnetCache.set(clean, resp.data);
        return resp.data;
      }
    } catch (_) {
      // Fall through to CLI fallback
    }
  }

  // 4. Fallback CLI execution
  const cliData = await queryCliFallback(clean);
  if (cliData) {
    wordnetCache.set(clean, cliData);
    return cliData;
  }

  // 5. Tagalog corpus fallback
  if (TL_CORPUS[clean]) {
    const tlEntry = TL_CORPUS[clean];
    const data = {
      word: clean,
      lemma: tlEntry.lemma || clean,
      synset: tlEntry.synsets[0].synset,
      pos: tlEntry.synsets[0].pos,
      definition: tlEntry.synsets[0].definition,
      hypernym: tlEntry.synsets[0].hypernym,
      synonyms: tlEntry.synsets[0].synonyms,
      synsets: tlEntry.synsets
    };
    wordnetCache.set(clean, data);
    return data;
  }

  return null;
}

function isProperNoun(word) {
  if (!word) return false;
  const lower = word.toLowerCase().trim();
  if (namesSet && namesSet.has(lower)) {
    return true;
  }
  return false;
}

function getStopwords() {
  return stopwordsSet;
}

function getNames() {
  return namesSet;
}

function getDaemonStatus() {
  return {
    isReady: isDaemonReady,
    cacheSize: wordnetCache.size,
    queueLength: pendingQueue.length,
    pythonBin: getPythonBin()
  };
}

module.exports = {
  getWordNet,
  isProperNoun,
  getStopwords,
  getNames,
  waitForReady,
  getDaemonStatus
};
