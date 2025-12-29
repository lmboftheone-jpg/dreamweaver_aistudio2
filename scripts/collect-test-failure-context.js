import fs from 'fs';

const results = JSON.parse(fs.readFileSync('playwright-results.json', 'utf8'));

let failures = [];

results.suites.forEach(suite => {
    suite.specs.forEach(spec => {
        spec.tests.forEach(test => {
            if (test.outcome === 'unexpected') {
                failures.push({
                    title: spec.title,
                    file: spec.file,
                    error: test.results[0]?.error?.message || '',
                    stack: test.results[0]?.error?.stack || ''
                });
            }
        });
    });
});

const context = {
    timestamp: new Date().toISOString(),
    failures
};

fs.writeFileSync(
    'failure-context.json',
    JSON.stringify(context, null, 2)
);

console.log('Failure context generated');
