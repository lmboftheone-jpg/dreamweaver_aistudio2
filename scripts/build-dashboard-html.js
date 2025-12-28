const fs = require('fs');

const scores = fs.readFileSync('ci/agent-scores.json', 'utf8');
const failures = fs.readFileSync('ci/agent-failures.json', 'utf8');
const trends = fs.readFileSync('ci/agent-failure-trends.json', 'utf8');

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Agent Performance Dashboard</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body { background:#0f172a; color:#e5e7eb; font-family:system-ui; padding:24px; }
.card { background:#020617; padding:16px; border-radius:12px; margin-bottom:12px; }
.score { font-size:28px; font-weight:700; }
</style>
</head>

<body>
<h1>🤖 Agent Performance Dashboard</h1>

<div id="cards"></div>
<canvas id="chart"></canvas>

<script id="scores" type="application/json">${scores}</script>
<script id="failures" type="application/json">${failures}</script>
<script id="trends" type="application/json">${trends}</script>

<script>
const scores = JSON.parse(document.getElementById('scores').textContent);

const root = document.getElementById('cards');
Object.entries(scores).forEach(([name, v]) => {
  const d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = \`
    <h3>\${name}</h3>
    <div class="score">\${v.average}</div>
    <div>Runs: \${v.runs}</div>
  \`;
  root.appendChild(d);
});

const ctx = document.getElementById('chart');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: Object.keys(scores),
    datasets: [{
      label: 'Average Score',
      data: Object.values(scores).map(v => v.average)
    }]
  },
  options: { scales:{ y:{ min:0, max:100 } } }
});
</script>

</body>
</html>
`;

fs.mkdirSync('dashboard', { recursive: true });
fs.writeFileSync('dashboard/agent-dashboard.html', html);

console.log('Single HTML dashboard generated');
