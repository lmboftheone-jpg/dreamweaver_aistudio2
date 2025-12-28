
import { test, expect } from '@playwright/test';

test.describe('Edge Case: Error Handling', () => {

    test('Handles 500 API Error gracefully', async ({ page }) => {
        // Mock failure
        await page.route('/api/gemini/story', async route => {
            await route.fulfill({ status: 500, json: { error: "Internal Server Error" } });
        });

        await page.goto('/');
        await page.getByTestId('start-weaving-btn').click();

        const promptInput = page.getByTestId('prompt-input');
        await promptInput.fill('This will fail.');

        // Handle dialogs (alert)
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('Story generation failed');
            dialog.dismiss();
        });

        await page.getByTestId('weave-button').click();

        // We expect the button to become enabled again (loading state finishes)
        // or remain on the same screen
        await expect(page.getByTestId('weave-button')).toBeEnabled();
    });

    test('Cannot submit empty prompt', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('start-weaving-btn').click();

        const weaveBtn = page.getByTestId('weave-button');
        // Button is disabled when prompt is empty
        await expect(weaveBtn).toBeDisabled();
    });
});
