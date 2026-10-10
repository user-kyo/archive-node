const fs = require('fs');

const dict = new Set();
for(let i=0; i<100000; i++) dict.add("word" + i);
dict.add("thinking");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function getEdits(word) {
  const edits = new Set();
  const n = word.length;
  // deletions
  for (let i = 0; i < n; i++) edits.add(word.slice(0, i) + word.slice(i + 1));
  // transpositions
  for (let i = 0; i < n - 1; i++) edits.add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  // substitutions
  for (let i = 0; i < n; i++) {
    for (const c of alphabet) edits.add(word.slice(0, i) + c + word.slice(i + 1));
  }
  // insertions
  for (let i = 0; i <= n; i++) {
    for (const c of alphabet) edits.add(word.slice(0, i) + c + word.slice(i));
  }
  return edits;
}

console.time("norvig");
for(let i=0; i<100; i++) {
  const candidates = getEdits("thikning");
  let found = null;
  for (const cand of candidates) {
    if (dict.has(cand)) { found = cand; break; }
  }
}
console.timeEnd("norvig");
