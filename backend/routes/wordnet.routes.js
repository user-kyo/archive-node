const express = require('express');
const { getWordNet, isProperNoun, getStopwords, getNames } = require('../services/nltkService');

const router = express.Router();

// GET /api/wordnet/corpora - Get NLTK English stopwords and names
router.get('/corpora', (req, res) => {
  const sw = getStopwords();
  const nm = getNames();
  res.json({
    stopwords: sw ? Array.from(sw) : [],
    names: nm ? Array.from(nm) : []
  });
});

// GET /api/wordnet/stopwords - Get NLTK English stopwords list
router.get('/stopwords', (req, res) => {
  const sw = getStopwords();
  if (sw) {
    return res.json({ stopwords: Array.from(sw) });
  }
  res.json({ stopwords: [] });
});

// GET /api/wordnet/check/proper/:word - Check if word is a proper noun according to NLTK
router.get('/check/proper/:word', (req, res) => {
  const word = req.params.word.trim();
  const proper = isProperNoun(word);
  res.json({ word, isProper: proper });
});

// GET /api/wordnet/:word - Query WordNet synset and definition powered by NLTK WordNet
router.get('/:word', async (req, res) => {
  const word = req.params.word.toLowerCase().trim();
  try {
    const entry = await getWordNet(word);
    if (entry) {
      const synsets = entry.synsets && entry.synsets.length ? entry.synsets : [entry];
      const first = synsets[0];
      return res.json({
        term: word,
        lemma: entry.lemma || word,
        synset: first.synset,
        pos: first.pos,
        hypernym: first.hypernym,
        definition: first.definition,
        synonyms: first.synonyms || [],
        examples: first.examples || [],
        synsets
      });
    }
  } catch (err) {
    console.warn(`[WordNet Route] Error querying NLTK for "${word}":`, err.message);
  }

  res.status(404).json({ error: `Term '${word}' not found in WordNet database` });
});

module.exports = router;
