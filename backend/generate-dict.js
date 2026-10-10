const fs = require('fs');
const wordListPath = require('word-list').default || require('word-list');
const path = require('path');

const wordsArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
// Filter words that are at least 4 letters, and maybe only 100,000 common ones to save size, or just dump all of them
const dictContent = `const FULL_ENGLISH_DICT = new Set(${JSON.stringify(wordsArray)});`;

fs.writeFileSync(path.join(__dirname, '../frontend/dict.js'), dictContent);
console.log('Dictionary created with ' + wordsArray.length + ' words');
