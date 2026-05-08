/**
 * PostHog client-side instrumentation for Next.js 15 App Router.
 *
 * This file runs once on the client and initializes PostHog for product
 * analytics, autocapture, session replay, and exception capture.
 *
 * The api_host is set to "/ingest" — that's a Next.js rewrite (see
 * next.config.ts) that proxies to PostHog. The rewrite means:
 *   1. From the browser's perspective, all PostHog requests are same-origin,
 *      so they aren't blocked by ad-blockers and don't require CSP changes.
 *   2. PostHog sees the user's real IP/UA via Next.js's standard forwarding.
 *
 * Do NOT also wrap the app in <PostHogProvider/>. instrumentation-client.ts
 * is the canonical Next.js 15.3+ pattern for client-side init — combining
 * it with a provider double-initializes PostHog and causes silent dedupe
 * of events.
 */
import posthog from 'posthog-js'

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  })
}
