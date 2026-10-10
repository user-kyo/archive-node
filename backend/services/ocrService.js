const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const { cleanOcrText } = require('../nlp/ocrCleaner');

let ocrWorkerInstance = null;

/**
 * Locate the directory containing eng.traineddata
 */
function getModelPath() {
  const frontendModels = path.join(__dirname, '../../frontend/models');
  if (fs.existsSync(path.join(frontendModels, 'eng.traineddata'))) {
    return frontendModels;
  }
  const directModels = path.join(__dirname, '../frontend/models');
  if (fs.existsSync(path.join(directModels, 'eng.traineddata'))) {
    return directModels;
  }
  return frontendModels;
}

/**
 * Reusable warm Tesseract worker for high-speed, local OCR
 */
async function getOcrWorker() {
  if (!ocrWorkerInstance) {
    const modelPath = getModelPath();
    ocrWorkerInstance = await Tesseract.createWorker('eng', 1, {
      langPath: modelPath,
      cachePath: modelPath
    });
  }
  return ocrWorkerInstance;
}

/**
 * Process image buffer and extract text with Google Lens word-level bounding boxes
 */
async function processImageOcr(imgBuffer) {
  const worker = await getOcrWorker();
  let result = null;

  try {
    result = await worker.recognize(imgBuffer, {}, { text: true, blocks: true });
  } catch (err) {
    console.warn('Tesseract worker recognition error, restarting worker:', err.message);
    try {
      await worker.terminate();
    } catch (_) {}
    ocrWorkerInstance = null;
    const freshWorker = await getOcrWorker();
    result = await freshWorker.recognize(imgBuffer, {}, { text: true, blocks: true });
  }

  const rawText = (result && result.data && result.data.text) ? result.data.text : '';
  const cleanText = cleanOcrText(rawText);
  const overallConfidence = (result && result.data && typeof result.data.confidence === 'number')
    ? Math.round(result.data.confidence)
    : 85;

  const lowConfidenceSet = new Set();
  const extractedWords = [];
  const seenBoxes = new Set();

  function processWordCandidate(w) {
    if (!w || !w.text) return;
    const cleanWord = w.text.replace(/^[^\w]+|[^\w]+$/g, '').trim();
    if (!cleanWord || cleanWord.length <= 1 && !/^[aAiI0-9]$/.test(cleanWord)) return;

    const conf = typeof w.confidence === 'number' ? Math.round(w.confidence) : 80;
    if (conf < 70 && cleanWord.length > 2) {
      lowConfidenceSet.add(cleanWord);
    }

    if (w.bbox) {
      const b = w.bbox;
      const key = `${Math.round(b.x0 / 4)}_${Math.round(b.y0 / 4)}_${Math.round(b.x1 / 4)}_${Math.round(b.y1 / 4)}`;
      if (!seenBoxes.has(key)) {
        seenBoxes.add(key);
        extractedWords.push({
          text: cleanWord,
          confidence: conf,
          bbox: {
            x0: b.x0,
            y0: b.y0,
            x1: b.x1,
            y1: b.y1
          }
        });
      }
    }
  }

  if (result && result.data && Array.isArray(result.data.blocks)) {
    for (const b of result.data.blocks) {
      if (Array.isArray(b.paragraphs)) {
        for (const p of b.paragraphs) {
          if (Array.isArray(p.lines)) {
            for (const l of p.lines) {
              if (Array.isArray(l.words)) {
                for (const w of l.words) {
                  processWordCandidate(w);
                }
              }
            }
          }
        }
      }
    }
  } else if (result && result.data && Array.isArray(result.data.words)) {
    for (const w of result.data.words) {
      processWordCandidate(w);
    }
  }

  return {
    text: cleanText,
    confidence: overallConfidence,
    lowConfidenceWords: Array.from(lowConfidenceSet).slice(0, 5),
    words: extractedWords
  };
}

module.exports = {
  getOcrWorker,
  processImageOcr
};
