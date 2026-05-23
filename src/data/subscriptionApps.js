// ─── src/data/subscriptionApps.js ─────────────────────────────────────────────
// App autocomplete — ONLY services with verified paid plans in Malaysia.

import { MALAYSIA_PLAN_CATALOG } from './subscriptions'

/**
 * Build directory from plan catalog only (every entry has ≥1 MY plan).
 * @typedef {{ name: string, category: string, aliases: string[], planCount: number }} AppEntry
 */

function buildDirectoryFromCatalog() {
  return MALAYSIA_PLAN_CATALOG.filter(
    (cat) => cat.plans?.length > 0 && cat.serviceName
  ).map((cat) => ({
    name: cat.serviceName,
    category: cat.category ?? 'Subscription',
    aliases: (cat.keywords ?? []).filter(
      (kw) => kw.toLowerCase() !== cat.serviceName.toLowerCase()
    ),
    planCount: cat.plans.length,
  }))
}

/** Apps that appear in the name dropdown — all have subscription plans available. */
export const APPS_WITH_META = buildDirectoryFromCatalog()

function scoreApp(app, query) {
  const name = app.name.toLowerCase()
  const aliases = app.aliases.map((a) => a.toLowerCase())

  if (name === query) return 100
  if (name.startsWith(query)) return 85
  if (name.includes(query)) return 70
  if (aliases.some((a) => a === query)) return 80
  if (aliases.some((a) => a.startsWith(query))) return 65
  if (aliases.some((a) => a.includes(query))) return 55

  const words = query.split(/\s+/).filter(Boolean)
  if (words.length > 1 && words.every((w) => name.includes(w) || aliases.some((a) => a.includes(w)))) {
    return 50
  }

  return 0
}

/**
 * Search subscription apps — only returns services with available MY plans.
 * No category-only matches; unknown text returns nothing.
 * @param {string} query
 * @param {number} limit
 */
export function searchSubscriptionApps(query, limit = 10) {
  const q = query.trim().toLowerCase()

  if (!q) {
    return APPS_WITH_META.slice(0, limit)
  }

  return APPS_WITH_META
    .map((app) => ({ app, score: scoreApp(app, q) }))
    .filter(({ score }) => score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ app }) => app)
}
