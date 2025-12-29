import fs from 'fs';

const g1 = JSON.parse(fs.readFileSync('gate1.json', 'utf8'));
const g2 = JSON.parse(fs.readFileSync('gate2.json', 'utf8'));
const g3 = JSON.parse(fs.readFileSync('gate3.json', 'utf8'));

const decision = {
    verdict: 'AI_CAN_FIX',
    reasons: []
};

if (g1.humanOnly) {
    decision.verdict = 'HUMAN_ONLY';
    decision.reasons.push(...g1.reasons);
}

if (g2.humanOnly) {
    decision.verdict = 'HUMAN_ONLY';
    decision.reasons.push('High change scope risk');
}

if (g3.humanOnly) {
    decision.verdict = 'HUMAN_ONLY';
    decision.reasons.push('Low auto-fix success rate');
}

fs.writeFileSync(
    'fix-decision.json',
    JSON.stringify(decision, null, 2)
);

console.log('Fix decision:', decision.verdict);
