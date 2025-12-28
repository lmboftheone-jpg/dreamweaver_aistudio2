const fs = require('fs');

const agent = fs.readFileSync('agent-name.txt', 'utf8').trim();
const scoreData = JSON.parse(fs.readFileSync('quality-score.json', 'utf8'));
const score = scoreData.score;

const file = 'ci/agent-scores.json';
let data = {};

if (fs.existsSync(file)) {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
}

if (!data[agent]) {
  data[agent] = { runs: 0, totalScore: 0, average: 0 };
}

data[agent].runs += 1;
data[agent].totalScore += score;
data[agent].average = Math.round(
  (data[agent].totalScore / data[agent].runs) * 100
) / 100;

fs.mkdirSync('ci', { recursive: true });
fs.writeFileSync(file, JSON.stringify(data, null, 2));

console.log(`Updated score for agent ${agent}`);
