/**
 * Thin wrapper around posthog-js that's safe to call from anywhere — SSR,
 * before init has run, or when no PostHog key is configured.
 *
 * The actual init lives in `instrumentation-client.ts` at the project root
 * and runs once on the client. These helpers no-op gracefully when called
 * server-side or before init.
 *
 * Use these helpers (not posthog directly) on conversion-critical surfaces
 * so the call site stays single-line and call sites can't accidentally
 * break SSR.
 */
import posthog from 'posthog-js'

const isClient = () => typeof window !== 'undefined'

/**
 * Capture an analytics event. No-ops on the server.
 *
 * @example
 *   capture('quote_form_submitted', { service: 'reparacion', urgency: 'now' })
 */
export function capture(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (!isClient()) return
  try {
    posthog.capture(event, properties)
  } catch {
    // Swallow — analytics must never break the user flow.
  }
}

/**
 * Identify the current visitor by a stable distinct ID (typically the user's
 * phone or email after auth). Subsequent events get attributed to this user.
 */
export function identify(
  distinctId: string,
  properties?: Record<string, unknown>
): void {
  if (!isClient()) return
  try {
    posthog.identify(distinctId, properties)
  } catch {
    /* swallow */
  }
}

/**
 * Reset the current visitor (call on logout) so the next session starts
 * with a fresh anonymous distinct ID.
 */
export function reset(): void {
  if (!isClient()) return
  try {
    posthog.reset()
  } catch {
    /* swallow */
  }
}

/**
 * Capture an unhandled exception manually. Mostly redundant with
 * `capture_exceptions: true` in the init, but useful when you've already
 * caught the error and want richer context.
 */
export function captureException(error: unknown, properties?: Record<string, unknown>): void {
  if (!isClient()) return
  try {
    posthog.captureException(error, properties)
  } catch {
    /* swallow */
  }
}
