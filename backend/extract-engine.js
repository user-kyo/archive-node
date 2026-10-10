const fs = require('fs');
const path = require('path');

const indexContent = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let jsCode = '';
let match;
while ((match = scriptRegex.exec(indexContent)) !== null) {
  jsCode += match[1] + '\n';
}

const lines = jsCode.split('\n');
const startIdx = lines.findIndex(l => l.includes('const KNOWN_WORDS = new Set(['));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('// 1. Contractions expansion'));

if (startIdx !== -1 && endIdx !== -1) {
  let engineCode = lines.slice(startIdx, endIdx).join('\n');
  engineCode = engineCode.replace(/const WORDNET_DB = \[\];/g, 'const WORDNET_DB = {};');
  engineCode = engineCode.replace(/\.\.\.Object\.keys\(WORDNET_DB\),/g, '');
  engineCode = engineCode.replace(/\.\.\.Object\.keys\(CAT\),/g, '');
  engineCode = engineCode.replace(/\.\.\.Object\.values\(LEMMA\),/g, '');
  engineCode = engineCode.replace(/\.\.\.Object\.keys\(LEMMA\),/g, '');
  engineCode = engineCode.replace(/\.\.\.TL_WORDS,/g, '');
  engineCode = engineCode.replace(/\.\.\.STOP,/g, '');
  engineCode = engineCode.replace(/\.\.\.TL_STOP,/g, '');
  engineCode = engineCode.replace(/\.\.\.NONTERM,/g, '');
  
  const testScript = `
    ${engineCode}
    console.log("curent ->", autocorrectWord("curent"));
    console.log("thikning ->", autocorrectWord("thikning"));
  `;
  
  fs.writeFileSync(path.join(__dirname, 'run-test.js'), testScript);
  console.log("Created run-test.js");
} else {
  console.log("Could not extract engine");
}
