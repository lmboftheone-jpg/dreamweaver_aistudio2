const fs = require('fs');

const data = JSON.parse(fs.readFileSync('quality-score.json', 'utf8'));

let body = `## 📊 Playwright Quality Score\n\n`;
body += `**Score:** ${data.score} / 100\n\n`;

body += `### Breakdown\n`;
body += `- 🔥 Critical: ${data.summary.criticalPassed}/${data.summary.criticalTotal}\n`;
body += `- ⚠️ Minor: ${data.summary.minorPassed}/${data.summary.minorTotal}\n`;
body += `- 🧪 Total: ${data.summary.passed}/${data.summary.total}\n`;
body += `- ⏱ Retries: ${data.summary.retries}\n\n`;

body += data.score >= 80
  ? `✅ **Merge Allowed**`
  : `❌ **Merge Blocked (Score < 80)**`;

fs.writeFileSync('quality-comment.md', body);
