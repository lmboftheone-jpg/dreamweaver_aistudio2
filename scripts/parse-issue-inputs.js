import fs from 'fs';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const body = event.issue?.body || '';

function has(text) {
    return body.includes(text);
}

// Agent (dropdown)
let agent = 'unknown';
if (body.includes('antigravity')) agent = 'antigravity';
if (body.includes('cursor')) agent = 'cursor';
if (body.includes('copilot')) agent = 'copilot';

// Expected result
const expected = {
    smokeOnly: body.includes('Smoke only'),
    fullPass: body.includes('Full pass'),
    failCritical: body.includes('Fail on Critical'),
    failScore: body.includes('Fail on Quality Score'),
    policyBlock: body.includes('Agent Policy Block')
};

// Test flags
const flags = {
    smokeOnly: has('Enable smoke test only'),
    forceCriticalFail: has('Force critical failure'),
    forceLowScore: has('Force low quality score'),
    simulateLowAgent: has('Simulate low-score agent'),
    disableAutoMerge: has('Disable auto merge')
};

const context = {
    agent,
    expected,
    flags
};

fs.writeFileSync(
    'issue-context.json',
    JSON.stringify(context, null, 2)
);

console.log('Parsed issue context:', context);
