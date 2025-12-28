const fs = require('fs');

const scores = JSON.parse(fs.readFileSync('ci/agent-scores.json', 'utf8'));
const agent = fs.readFileSync('agent-name.txt', 'utf8').trim();

if (!scores[agent]) {
  console.log('No score record. Treat as Normal.');
  process.exit(0);
}

const { average, runs } = scores[agent];

let level = 'normal';
if (average >= 90 && runs >= 5) level = 'trusted';
else if (average < 70) level = 'quarantined';
else if (average < 80) level = 'restricted';

fs.writeFileSync('agent-policy.json', JSON.stringify({ agent, level, average, runs }, null, 2));
console.log(`Agent ${agent} → ${level}`);
