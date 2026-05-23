// ─── src/hooks/useGeminiMalaysianPlans.js ──────────────────────────────────────
// Fetches ALL Malaysia-available plans via Gemini (never a single seed plan).

import { useCallback, useRef, useState } from 'react'
import {
  callGeminiJson,
  extractUrl,
  getGeminiApiKey,
  parseJsonFromText,
} from '../utils/geminiClient'
import { MALAYSIA_PLAN_CATALOG } from '../data/subscriptions'

function matchCatalogPlans(appName) {
  const query = appName.trim().toLowerCase()
  if (query.length < 2) return null

  const entry = MALAYSIA_PLAN_CATALOG.find((cat) =>
    cat.keywords.some(
      (kw) => query === kw || query.includes(kw) || kw.includes(query)
    )
  )

  if (!entry) return null

  const plans = entry.plans.map((p, i) => ({
    id: `catalog-${entry.serviceName}-${i}`,
    name: p.name,
    monthlyRM: p.monthlyRM,
    cancelUrl: entry.defaultCancelUrl,
  }))

  return {
    serviceName: entry.serviceName,
    defaultCancelUrl: entry.defaultCancelUrl,
    plans,
    source: 'catalog',
    errorMessage: null,
  }
}

function normalizePlans(raw, fallbackName) {
  const defaultCancelUrl =
    extractUrl(raw?.defaultCancelUrl) ||
    extractUrl(raw?.cancelUrl) ||
    null

  const plans = (Array.isArray(raw?.plans) ? raw.plans : [])
    .map((p, i) => {
      const name = String(p.name ?? p.plan ?? '').trim()
      const monthlyRM = Number(p.monthlyRM ?? p.monthly_rm ?? p.cost ?? p.price)
      const cancelUrl =
        extractUrl(p.cancelUrl ?? p.cancel_url ?? p.url) || defaultCancelUrl

      return {
        id: `plan-${i}-${name.slice(0, 12).replace(/\s/g, '-') || i}`,
        name,
        monthlyRM,
        cancelUrl: cancelUrl || '',
      }
    })
    .filter((p) => p.name && Number.isFinite(p.monthlyRM) && p.monthlyRM > 0)

  return {
    serviceName: String(raw?.serviceName ?? raw?.service ?? fallbackName).trim(),
    defaultCancelUrl,
    plans,
  }
}

function finalizePlans({ serviceName, defaultCancelUrl, plans, source, errorMessage }) {
  const enriched = plans.map((p) => ({
    ...p,
    cancelUrl: p.cancelUrl || defaultCancelUrl || '',
  }))

  const withUrls =
    enriched.filter((p) => p.cancelUrl).length > 0
      ? enriched.filter((p) => p.cancelUrl)
      : defaultCancelUrl
        ? enriched.map((p) => ({ ...p, cancelUrl: defaultCancelUrl }))
        : []

  return {
    serviceName,
    defaultCancelUrl,
    plans: withUrls,
    source: withUrls.length ? source : 'not_found',
    errorMessage: withUrls.length
      ? null
      : errorMessage || 'No plans with cancel URLs found — try again or enter manually.',
  }
}

const PLANS_PROMPT = (name) => `You are a subscription pricing expert for Malaysia. Currency is Malaysian Ringgit (RM/MYR).

For this service/app: "${name}"

List EVERY paid subscription tier currently sold to individual consumers in Malaysia — not just one plan.

Examples of what to include when they exist:
- Spotify: Premium Student, Individual, Duo, Family (all separate entries)
- Netflix: Mobile, Basic, Standard, Premium
- Adobe: Photography, Single App, All Apps, Student tiers

Return ONLY valid JSON:
{
  "serviceName": "Official product name",
  "defaultCancelUrl": "https://official-billing-or-subscription-management-page",
  "plans": [
    {
      "name": "Exact tier name as marketed in MY",
      "monthlyRM": 19.90,
      "cancelUrl": "https://official-cancel-or-manage-url"
    }
  ]
}

Rules:
- Include ALL major paid tiers (typically 3–8 plans). Never return only Student or only one tier.
- Order plans cheapest to most expensive by monthlyRM.
- monthlyRM = typical monthly price in RM (annual plans: divide by 12, round to 2 decimals).
- cancelUrl must be official HTTPS on the provider's domain; use defaultCancelUrl for all if shared.
- Skip free-only tiers unless no paid plans exist.`

export function useGeminiMalaysianPlans() {
  const [loading, setLoading] = useState(false)
  const requestIdRef = useRef(0)

  const fetchPlans = useCallback(async (appName) => {
    const name = appName.trim()
    if (name.length < 2) {
      return {
        plans: [],
        serviceName: '',
        defaultCancelUrl: null,
        source: null,
        errorMessage: 'Enter at least 2 characters.',
      }
    }

    if (!getGeminiApiKey()) {
      const catalog = matchCatalogPlans(name)
      if (catalog) return catalog
      return {
        plans: [],
        serviceName: name,
        defaultCancelUrl: null,
        source: 'no_api',
        errorMessage: 'Missing API key — copy .env.example to .env and restart the dev server.',
      }
    }

    const requestId = ++requestIdRef.current
    setLoading(true)

    try {
      const { text, error: apiError } = await callGeminiJson({
        prompt: PLANS_PROMPT(name),
        temperature: 0.15,
        maxOutputTokens: 2048,
      })

      if (requestId !== requestIdRef.current) {
        return { plans: [], serviceName: name, defaultCancelUrl: null, source: null, errorMessage: null }
      }

      if (!text) {
        const catalog = matchCatalogPlans(name)
        if (catalog) return catalog
        return {
          plans: [],
          serviceName: name,
          defaultCancelUrl: null,
          source: 'error',
          errorMessage: apiError || 'Could not reach Gemini. Check your API key and network.',
        }
      }

      const raw = parseJsonFromText(text)
      if (!raw) {
        const catalog = matchCatalogPlans(name)
        if (catalog) return catalog
        return {
          plans: [],
          serviceName: name,
          defaultCancelUrl: null,
          source: 'parse_error',
          errorMessage: 'Could not read plan data from AI — try again or enter manually.',
        }
      }

      const { serviceName, defaultCancelUrl, plans } = normalizePlans(raw, name)

      if (plans.length === 0) {
        const catalog = matchCatalogPlans(name)
        if (catalog) return catalog
      }

      return finalizePlans({
        serviceName,
        defaultCancelUrl,
        plans,
        source: 'gemini',
        errorMessage: null,
      })
    } catch (err) {
      console.warn('[SUBsidized] Malaysian plans lookup failed:', err.message)
      const catalog = matchCatalogPlans(name)
      if (catalog) return catalog
      return {
        plans: [],
        serviceName: name,
        defaultCancelUrl: null,
        source: 'error',
        errorMessage: err.message,
      }
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

  return {
    fetchPlans,
    loading,
    cancelPending,
    hasApiKey: Boolean(getGeminiApiKey()),
  }
}
