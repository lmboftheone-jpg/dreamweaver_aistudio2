const fs = require('fs');

const cases = JSON.parse(fs.readFileSync('test-cases.json', 'utf8'));

let code = `
import { test, expect } from '@playwright/test';

test.describe('Auto-generated tests from Issue', () => {
`;

cases.tests.forEach(tc => {
    code += `
  test('${tc.title}', async ({ page }) => {
`;

    tc.steps.forEach(step => {
        if (step.action === 'goto') {
            code += `    await page.goto('${step.target}');\n`;
        }
        if (step.action === 'click') {
            code += `    await page.click('${step.target}');\n`;
        }
        if (step.action === 'fill') {
            code += `    await page.fill('${step.target}', '${step.value}');\n`;
        }
        if (step.action === 'expectVisible') {
            code += `    await expect(page.locator('${step.target}')).toBeVisible();\n`;
        }
        if (step.action === 'expectUrl') {
            code += `    await expect(page).toHaveURL(/${step.target}/);\n`;
        }
    });

    code += `  });\n`;
});

code += `});\n`;

fs.mkdirSync('tests/auto', { recursive: true });
fs.writeFileSync('tests/auto/issue-generated.spec.ts', code);

console.log('Playwright tests generated');
