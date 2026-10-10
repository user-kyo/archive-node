const express = require('express');
const WORDNET_DATA = require('../data/wordnet');

const router = express.Router();

// GET /api/wordnet/:word - Query WordNet synset and definition
router.get('/:word', (req, res) => {
  const word = req.params.word.toLowerCase().trim();
  const entry = WORDNET_DATA[word] || null;

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
      synonyms: first.synonyms,
      synsets
    });
  }

  res.status(404).json({ error: 'Term not found in WordNet database' });
});

module.exports = router;
