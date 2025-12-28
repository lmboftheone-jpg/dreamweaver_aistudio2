const fs = require('fs');

const ctx = JSON.parse(fs.readFileSync('failure-context.json', 'utf8'));

let scopeRisk = 0;

ctx.failures.forEach(f => {
    if (f.file.includes('auth') || f.file.includes('config')) scopeRisk += 2;
    if (f.file.includes('core') || f.file.includes('db')) scopeRisk += 2;
    if (f.file.includes('tests')) scopeRisk += 3;
});

const verdict = {
    scopeRisk,
    humanOnly: scopeRisk >= 3
};

fs.writeFileSync('gate2.json', JSON.stringify(verdict, null, 2));
