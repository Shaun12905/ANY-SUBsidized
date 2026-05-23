// ─── src/hooks/useGeminiCancelUrl.js ─────────────────────────────────────────
// Resolves an official subscription cancellation URL from an app/service name.

import { useCallback, useRef, useState } from 'react'
import { callGemini, extractUrl, getGeminiApiKey } from '../utils/geminiClient'
import { INITIAL_SUBSCRIPTIONS } from '../data/subscriptions'

/** Instant match for seeded services (works without API key). */
function matchKnownUrl(appName) {
  const query = appName.trim().toLowerCase()
  if (query.length < 2) return null

  const hit = INITIAL_SUBSCRIPTIONS.find((sub) => {
    const name = sub.name.toLowerCase()
    return name === query || name.includes(query) || query.includes(name)
  })
  return hit?.url ?? null
}

export function useGeminiCancelUrl() {
  const [loading, setLoading] = useState(false)
  const requestIdRef = useRef(0)

  const lookup = useCallback(async (appName) => {
    const name = appName.trim()
    if (name.length < 2) return { url: null, source: null }

    const known = matchKnownUrl(name)
    if (known) return { url: known, source: 'known' }

    if (!getGeminiApiKey()) {
      return { url: null, source: 'no_api' }
    }

    const requestId = ++requestIdRef.current
    setLoading(true)

    try {
      const text = await callGemini({
        prompt: `You are a subscription billing expert. A user wants to cancel their subscription to: "${name}".

Return ONLY the official HTTPS URL where a customer can cancel or manage that subscription (billing, account subscription, or membership settings page). Use the real domain operated by the service — not app stores, not third-party blogs.

Rules:
- Output a single URL only. No markdown, quotes, labels, or explanation.
- Prefer the global English account/billing page.
- If the service has no reliable official cancel URL you are confident about, output exactly: UNKNOWN`,
        temperature: 0.1,
        maxOutputTokens: 128,
      })

      if (requestId !== requestIdRef.current) {
        return { url: null, source: null }
      }

      const url = extractUrl(text)
      return { url, source: url ? 'gemini' : 'not_found' }
    } catch (err) {
      console.warn('[SUBsidized] Cancel URL lookup failed:', err.message)
      return { url: null, source: 'error' }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const cancelPending = useCallback(() => {
    requestIdRef.current += 1
    setLoading(false)
  }, [])

  return { lookup, loading, cancelPending, hasApiKey: Boolean(getGeminiApiKey()) }
}
