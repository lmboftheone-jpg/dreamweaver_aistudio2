const fs = require('fs');

const resultFile = 'playwright-results.json';

if (!fs.existsSync(resultFile)) {
  console.log('No Playwright result file found.');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(resultFile, 'utf8'));

let failedTests = [];

data.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    spec.tests.forEach(test => {
      if (test.outcome === 'unexpected') {
        failedTests.push({
          title: spec.title,
          file: spec.file,
          error: test.results[0]?.error?.message || 'Unknown error',
        });
      }
    });
  });
});

if (failedTests.length === 0) {
  console.log('No failed tests.');
  process.exit(0);
}

let comment = `## ❌ Playwright E2E Tests Failed\n\n`;

failedTests.slice(0, 5).forEach(t => {
  comment += `- **${t.title}**\n`;
  comment += `  - File: \`${t.file}\`\n`;
  comment += `  - Error: ${t.error.split('\n')[0]}\n\n`;
});

comment += `📎 **Playwright HTML Report** is attached as artifact.\n`;

fs.writeFileSync('playwright-comment.md', comment);
