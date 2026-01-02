
import { test, expect } from '@playwright/test';

test.describe('Core Flow: Story Creation', () => {

    // Mock API routes
    test.beforeEach(async ({ page }) => {
        // Mock Story Generation
        await page.route('/api/gemini/story', async route => {
            const json = {
                title: "Test Story: The Brave QA Engineer",
                author: "Playwright Bot",
                isBranching: false,
                pages: [
                    { id: "p1", content: "Once upon a time, a QA engineer wrote a perfect test.", pageNumber: 1, illustrationUrl: "https://picsum.photos/200" },
                    { id: "p2", content: "The build passed green forever after.", pageNumber: 2, illustrationUrl: "https://picsum.photos/200" }
                ]
            };
            await route.fulfill({ json });
        });

        // Mock Image Generation (Cover & Pages)
        await page.route('/api/gemini/image', async route => {
            await route.fulfill({ json: { image: "https://picsum.photos/seed/mock/800/800" } });
        });
    });

    test('User can create a simple linear story', async ({ page }) => {
        await page.goto('/');

        // 1. Enter Creator Mode
        await page.getByTestId('start-weaving-btn').click();

        // 2. Fill Prompt
        const promptInput = page.getByTestId('prompt-input');
        await expect(promptInput).toBeVisible();
        await promptInput.fill('A story about automated testing.');

        // 3. Click Weave
        const weaveBtn = page.getByTestId('weave-button');
        await expect(weaveBtn).toBeEnabled();
        await weaveBtn.click();

        // 4. Verify Output (Draft Title should appear)
        // The UI shows "Create Your Adventure" initially, then updates to Title upon previewDraft being set.
        // We expect "Test Story: The Brave QA Engineer" from our mock.
        await expect(page.locator('h2', { hasText: 'Test Story: The Brave QA Engineer' })).toBeVisible({ timeout: 10000 });

        // 5. Check Pages
        await expect(page.getByText('Once upon a time')).toBeVisible();
    });
});
