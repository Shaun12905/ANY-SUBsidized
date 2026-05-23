// ─── src/utils/geminiClient.js ───────────────────────────────────────────────
// Shared Gemini client — tries current models with fallbacks.

const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash']

export function getGeminiApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  return key && key !== 'YOUR_API_KEY' && key !== 'YOUR_API_KEY_HERE' ? key : null
}

async function geminiFetch(body) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) return { text: null, error: 'no_api' }

  let lastError = null

  for (const model of MODELS) {
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

    try {
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        lastError = `Gemini (${model}): ${response.status} ${response.statusText}${detail ? ` — ${detail.slice(0, 120)}` : ''}`
        continue
      }

      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        lastError = `Gemini (${model}): empty response`
        continue
      }

      return { text: text.trim(), error: null }
    } catch (err) {
      lastError = err.message
    }
  }

  return { text: null, error: lastError || 'Gemini request failed' }
}

export async function callGemini({ prompt, temperature = 0.3, maxOutputTokens = 256 }) {
  const { text } = await geminiFetch({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens },
  })
  return text
}

export async function callGeminiJson({ prompt, temperature = 0.2, maxOutputTokens = 1200 }) {
  const { text, error } = await geminiFetch({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseMimeType: 'application/json',
    },
  })

  if (text) return { text, error: null }

  const fallback = await geminiFetch({
    contents: [{ parts: [{ text: `${prompt}\n\nRespond with ONLY raw JSON, no markdown fences.` }] }],
    generationConfig: { temperature, maxOutputTokens },
  })

  return { text: fallback.text, error: fallback.text ? null : (error || fallback.error) }
}

export function parseJsonFromText(text) {
  if (!text) return null
  try {
    return JSON.parse(text.trim())
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

export function extractUrl(text) {
  if (!text || /UNKNOWN/i.test(String(text).trim())) return null
  const match = String(text).match(/https?:\/\/[^\s"'<>\])]+/i)
  if (!match) return null
  return match[0].replace(/[.,;:!?)]+$/, '')
}
