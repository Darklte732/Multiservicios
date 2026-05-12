/**
 * Shared helpers for mobile QA Playwright tests.
 * Used by all 4 mobile-QA agent test suites.
 */

import { devices } from '@playwright/test'

export const BASE_URL = process.env.QA_BASE_URL ?? 'http://localhost:3000'

/**
 * Curated device matrix. Touch a representative set, not every device.
 */
export const IOS_DEVICES = {
  'iPhone 14 Pro': devices['iPhone 14 Pro'],
  'iPhone SE': devices['iPhone SE'],
} as const

export const ANDROID_DEVICES = {
  'Pixel 7': devices['Pixel 7'],
  'Galaxy S24': devices['Galaxy S24'] ?? devices['Galaxy S9+'], // fallback if S24 preset absent
} as const

/**
 * A "finding" emitted into the markdown report.
 * Keep it small — agents append these to a list and the report writer renders.
 */
export interface Finding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  area: string
  device: string
  description: string
  evidence?: string // screenshot path
}

export function fmtFinding(f: Finding): string {
  return `- **[${f.severity}]** *(${f.device} · ${f.area})* ${f.description}${f.evidence ? `\n  - screenshot: \`${f.evidence}\`` : ''}`
}
