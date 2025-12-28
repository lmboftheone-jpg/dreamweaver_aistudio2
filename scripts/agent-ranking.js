const fs = require('fs');

const data = JSON.parse(fs.readFileSync('ci/agent-scores.json', 'utf8'));

const ranking = Object.entries(data)
  .map(([name, v]) => ({
    name,
    average: v.average,
    runs: v.runs
  }))
  .sort((a, b) => b.average - a.average);

let body = `## 🏆 Agent Quality Ranking\n\n`;

ranking.forEach((a, i) => {
  body += `${i + 1}. **${a.name}** — ${a.average} (${a.runs} runs)\n`;
});

fs.writeFileSync('agent-ranking.md', body);
