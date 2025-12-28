const fs = require('fs');

const agent = fs.readFileSync('agent-name.txt', 'utf8').trim();
const results = JSON.parse(fs.readFileSync('playwright-results.json', 'utf8'));

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const file = 'ci/agent-failure-trends.json';

const patterns = [
  { type: 'TIMEOUT', match: /Timeout/i },
  { type: 'SELECTOR', match: /selector|element/i },
  { type: 'ASSERTION', match: /expect|assert/i },
  { type: 'NAVIGATION', match: /navigation|route|redirect/i },
  { type: 'NETWORK', match: /network|fetch|5\d\d/i },
  { type: 'CRASH', match: /TypeError|ReferenceError/i }
];

let data = fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file, 'utf8'))
  : {};

data[agent] = data[agent] || {};
data[agent][today] = data[agent][today] || {};

function classify(msg = '') {
  for (const p of patterns) {
    if (p.match.test(msg)) return p.type;
  }
  return 'UNKNOWN';
}

results.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    spec.tests.forEach(test => {
      if (test.outcome === 'unexpected') {
        const msg = test.results[0]?.error?.message || '';
        const type = classify(msg);
        data[agent][today][type] =
          (data[agent][today][type] || 0) + 1;
      }
    });
  });
});

fs.mkdirSync('ci', { recursive: true });
fs.writeFileSync(file, JSON.stringify(data, null, 2));

console.log('Failure trend updated');
