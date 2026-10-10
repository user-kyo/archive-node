/**
 * OCR Text Cleaner & Sanitizer
 * Removes noise symbols, stray divider borders, and OCR confusions while preserving valid study notes.
 */
function cleanOcrText(text) {
  if (!text) return '';

  let s = text;

  // 1. Remove non-printable / control / non-standard noise characters
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  // Remove typical OCR clutter symbols that never belong in study notes
  s = s.replace(/[§©®™°±¢€¥«»¿¡¶•~^\\\/|`¤¥§¨©ª«®¯°±²³´µ¶·¸¹º»¼½¾¿×÷]/g, ' ');

  // 2. Fix hyphenated line breaks (e.g. 'photo-\nsynthesis' -> 'photosynthesis')
  s = s.replace(/([A-Za-z]+)-\s*\r?\n\s*([A-Za-z]+)/g, '$1$2');

  // 3. Normalize quotes and apostrophes
  s = s.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  s = s.replace(/[\u201C\u201D\u201E\u201F]/g, '"');

  // 4. Process line by line to remove border lines and symbol clusters
  const lines = s.split(/\r?\n/).map(line => {
    let l = line.trim();

    // Remove stray horizontal divider / border lines composed purely of symbols
    if (/^[-_=+*~#|:;., '"]+$/.test(l)) return '';

    // Split into tokens to filter noise words
    const tokens = l.split(/\s+/).map(t => {
      // Strip leading/trailing symbol noise, keep punctuation at word boundaries
      let cleanT = t.replace(/^[^A-Za-z0-9"'(]+|[^A-Za-z0-9"'!?,.:;)]+$/g, '');

      // If token has no alphanumeric characters, discard
      if (!/[A-Za-z0-9]/.test(cleanT)) return '';

      // If token is a single stray symbol or single consonant floating alone
      if (cleanT.length === 1 && !/^[aAiI0-9]$/.test(cleanT)) return '';

      // Clean common OCR letter/digit confusions inside alphabetical words
      cleanT = cleanT.replace(/\b0([a-z]{2,})/gi, 'O$1')            // '0xygen' -> 'Oxygen'
                     .replace(/([A-Za-z]+)0([A-Za-z]+)/g, '$1o$2')  // 'gluc0se' -> 'glucose'
                     .replace(/\bsunllght\b/gi, 'sunlight')         // 'sunllght' -> 'sunlight'
                     .replace(/\b1([a-z]{2,})/g, 'l$1')             // '1eaf' -> 'leaf'
                     .replace(/([A-Za-z]+)11\b/g, '$1ll')           // 'chlorophy11' -> 'chlorophyll'
                     .replace(/([A-Za-z]+)11([A-Za-z]+)/g, '$1ll$2')// 'ce11ular' -> 'cellular'
                     .replace(/([A-Za-z]+)1([A-Za-z]+)/g, '$1l$2')  // internal 1 -> l
                     .replace(/([a-z]+)5([a-z]+)/gi, '$1s$2');      // 'sy5tem' -> 'system'

      // Filter out tokens that are mostly punctuation/numbers mixed with 1 letter (e.g. '@#$1a!')
      const alphaCount = (cleanT.match(/[A-Za-z]/g) || []).length;
      const nonAlphaCount = cleanT.length - alphaCount;
      if (cleanT.length > 3 && nonAlphaCount > alphaCount && !/\d+([.,]\d+)?%?/.test(cleanT)) {
        return '';
      }

      return cleanT;
    }).filter(Boolean);

    return tokens.join(' ');
  }).filter(line => line.length > 0);

  let result = lines.join('\n');

  // Fix spacing before punctuation (e.g. 'word .' -> 'word.')
  result = result.replace(/\s+([,.:;?!])/g, '$1');

  // Collapse repeated punctuation noise (e.g. '....' -> '...', ';;' -> ';')
  result = result.replace(/\.{4,}/g, '...');
  result = result.replace(/([,;:?!])\1+/g, '$1');

  // Collapse multiple blank lines or multiple spaces
  result = result.replace(/[ \t]{2,}/g, ' ');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

module.exports = {
  cleanOcrText
};
