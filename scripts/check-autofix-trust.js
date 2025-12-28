const fs = require('fs');

const agent = fs.readFileSync('agent-name.txt', 'utf8').trim();
const stats = JSON.parse(
    fs.readFileSync('ci/agent-autofix-stats.json', 'utf8')
);

const s = stats[agent] || { attempts: 0, success: 0 };
const rate = s.attempts === 0 ? 1 : s.success / s.attempts;

const verdict = {
    rate,
    humanOnly: rate < 0.6
};

fs.writeFileSync('gate3.json', JSON.stringify(verdict, null, 2));
