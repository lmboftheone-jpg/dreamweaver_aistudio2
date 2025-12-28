import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-results.json' }],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
