import fs from 'fs';

const resultFile = 'playwright-results.json';
if (!fs.existsSync(resultFile)) {
  console.error('Playwright result file not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(resultFile, 'utf8'));

let total = 0;
let passed = 0;
let criticalTotal = 0;
let criticalPassed = 0;
let minorTotal = 0;
let minorPassed = 0;
let retries = 0;

data.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    const file = spec.file || '';
    const isCritical = file.includes('/critical/');
    const isMinor = file.includes('/minor/');

    spec.tests.forEach(test => {
      total++;
      if (test.outcome === 'expected') passed++;
      if (test.results.some(r => r.retry > 0)) retries++;

      if (isCritical) {
        criticalTotal++;
        if (test.outcome === 'expected') criticalPassed++;
      }
      if (isMinor) {
        minorTotal++;
        if (test.outcome === 'expected') minorPassed++;
      }
    });
  });
});

const rate = (p, t) => (t === 0 ? 1 : p / t);

const score =
  rate(criticalPassed, criticalTotal) * 50 +
  rate(minorPassed, minorTotal) * 20 +
  Math.max(0, 1 - retries / Math.max(1, total)) * 15 +
  rate(passed, total) * 15;

const finalScore = Math.round(score);

fs.writeFileSync(
  'quality-score.json',
  JSON.stringify(
    {
      score: finalScore,
      summary: {
        total,
        passed,
        criticalPassed,
        criticalTotal,
        minorPassed,
        minorTotal,
        retries,
      },
    },
    null,
    2
  )
);

console.log(`Quality Score: ${finalScore}`);
process.exit(finalScore >= 80 ? 0 : 2);
