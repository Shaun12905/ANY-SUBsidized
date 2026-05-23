// ─── src/hooks/useGeminiRetention.js ─────────────────────────────────────────
// Gemini 1.5 Flash retention script — profile-aware, with static fallback.

import { useState, useCallback } from 'react'
import { DEFAULT_RETENTION_SCRIPT } from '../data/subscriptions'
import { callGemini, getGeminiApiKey } from '../utils/geminiClient'

export function useGeminiRetention(profile) {
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const generate = useCallback(async (subscription) => {
    setLoading(true)
    setError(null)
    setScript('')
    setUsingFallback(false)

    const fallback =
      subscription.retentionScript || DEFAULT_RETENTION_SCRIPT(subscription, profile)

    if (!getGeminiApiKey()) {
      await new Promise((r) => setTimeout(r, 600))
      setScript(fallback)
      setUsingFallback(true)
      setLoading(false)
      return
    }

    const mealCost = profile.mealCost > 0 ? profile.mealCost : 10
    const allowance = profile.allowance > 0 ? profile.allowance : 1000
    const plates = (subscription.cost / mealCost).toFixed(1)
    const yearlyRM = (subscription.cost * 12).toFixed(2)
    const swap = subscription.swap

    const prompt = `You are a financial advisor helping a Malaysian university student cancel or negotiate a discount on a paid subscription. Write a polite, firm, and emotionally intelligent cancellation/retention negotiation script the student can copy-paste into a live chat or email.

Context:
- Student at ${profile.university}, monthly allowance: RM${allowance}
- Subscription: ${subscription.name} ${subscription.plan}
- Monthly cost: RM${subscription.cost.toFixed(2)} (${plates} plates of chicken rice / ${((subscription.cost / allowance) * 100).toFixed(1)}% of total allowance)
- Yearly cost: RM${yearlyRM}
- Direct cancellation URL: ${subscription.url}
${swap ? `- Free alternative: ${swap.name} — ${swap.tagline}` : ''}

Requirements:
1. Open with a friendly, personal greeting
2. State clearly that you are a university student on a fixed allowance
3. Mention the specific RM cost and what percentage of income it represents
4. Reference that you've found a free alternative${swap ? ` (${swap.name})` : ''}
5. Ask specifically for: student discount, payment pause, or lower tier
6. Be firm but not aggressive — leave the door open for them to offer something
7. Close professionally

Format: Plain text paragraphs. No markdown. No bullet points. Under 200 words. Copy-paste ready.`

    try {
      const text = await callGemini({ prompt, temperature: 0.7, maxOutputTokens: 400 })
      setScript(text?.trim() || fallback)
      if (!text) setUsingFallback(true)
    } catch (err) {
      console.warn('[SUBsidized] Gemini error, using fallback:', err.message)
      setScript(fallback)
      setUsingFallback(true)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [profile])

  return { generate, script, loading, error, usingFallback }
}
