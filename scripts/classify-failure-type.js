const fs = require('fs');

const ctx = JSON.parse(fs.readFileSync('failure-context.json', 'utf8'));

function isHumanOnly(f) {
    const msg = (f.error + f.stack).toLowerCase();
    return (
        msg.includes('auth') ||
        msg.includes('permission') ||
        msg.includes('security') ||
        msg.includes('migration') ||
        msg.includes('schema') ||
        msg.includes('production') ||
        msg.includes('token')
    );
}

const verdict = {
    humanOnly: ctx.failures.some(isHumanOnly),
    reasons: []
};

if (verdict.humanOnly) {
    verdict.reasons.push('Sensitive failure type detected');
}

fs.writeFileSync('gate1.json', JSON.stringify(verdict, null, 2));
