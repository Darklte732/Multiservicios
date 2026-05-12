import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './playwright-tests',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: process.env.QA_BASE_URL ?? 'http://localhost:3000',
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
})
