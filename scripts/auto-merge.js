const fs = require('fs');

const scoreData = JSON.parse(fs.readFileSync('quality-score.json', 'utf8'));
const score = scoreData.score;

if (score < 90) {
  console.log(`Score ${score} < 90. Auto merge skipped.`);
  process.exit(0);
}

console.log(`Score ${score} >= 90. Auto merge allowed.`);
process.exit(0);
