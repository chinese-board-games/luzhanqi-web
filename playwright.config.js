import { defineConfig, devices } from '@playwright/test';

// the suite always drives a already-running deployment rather than starting
// one itself: in CI that's the Netlify staging site promote.yml just waited
// on, and locally it's whatever `npm start` is serving.
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  // a full playthrough is two browsers exchanging socket messages through a
  // real backend, so it needs far longer than the 30s default
  timeout: 3 * 60 * 1000,
  expect: { timeout: 20 * 1000 },
  // one game at a time - parallel runs would race on the shared staging backend
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    // Render's staging tier cold-starts, so the first socket handshake and
    // the REST calls behind it can be slow
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
