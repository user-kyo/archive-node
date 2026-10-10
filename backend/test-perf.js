const fs = require('fs');

function editDistance(a, b) {
  const al = a.length, bl = b.length;
  if (Math.abs(al - bl) > 1) return 99;
  const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) dp[i][0] = i;
  for (let j = 0; j <= bl; j++) dp[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[al][bl];
}

const words = [];
for (let i = 0; i < 50000; i++) words.push("word" + i);

console.time("editDistance");
for (let i = 0; i < 100; i++) {
  let min = 99;
  for (const w of words) {
    if (Math.abs(w.length - 6) > 1) continue;
    const d = editDistance("thikng", w);
    if (d < min) min = d;
  }
}
console.timeEnd("editDistance");
