import fs from 'fs';

const failures = JSON.parse(fs.readFileSync('failure-context.json', 'utf8'));
const tests = JSON.parse(fs.readFileSync('test-cases.json', 'utf8'));

const prompt = `
You are a senior software engineer.

Your task:
- Fix the code so that ALL tests pass.
- Make the MINIMUM changes required.
- Do NOT refactor unrelated code.
- Do NOT change tests.

Context:
${JSON.stringify(failures, null, 2)}

Test Cases:
${JSON.stringify(tests, null, 2)}

Output:
- Provide ONLY the code changes (patch or full file).
- Explain briefly why this fixes the test.
`;

fs.writeFileSync('fix-prompt.txt', prompt);
console.log('Fix prompt generated');
