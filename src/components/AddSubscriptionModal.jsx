// ─── src/components/AddSubscriptionModal.jsx ─────────────────────────────────
// Explicit "Find Plans" search + optional auto-search toggle.

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  X, Plus, AppWindow, Link, Tag, Wallet, Loader2,
  Search, AlertCircle,
} from 'lucide-react'
import { CUSTOM_SUBSCRIPTION_STYLE } from '../data/subscriptions'
import { useGeminiMalaysianPlans } from '../hooks/useGeminiMalaysianPlans'
import AppNameCombobox from './AppNameCombobox'
import PlanSelectDropdown, { MANUAL_PLAN_KEY } from './PlanSelectDropdown'

const emptyForm = { name: '', plan: '', cost: '', url: '' }

const inputClass =
  'w-full rounded-xl bg-white/[0.04] border border-zinc-700/80 focus:border-rose-500/40 px-3 py-2.5 text-sm text-white font-body placeholder:text-white/20 transition-colors outline-none'

function FieldLabel({ icon: Icon, children }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
      <Icon size={11} className="text-white/30" />
      {children}
    </label>
  )
}

export default function AddSubscriptionModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const [plans, setPlans] = useState([])
  const [selectedPlanKey, setSelectedPlanKey] = useState('')
  const [manualMode, setManualMode] = useState(false)
  const [autoSearch, setAutoSearch] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const fieldsTouchedRef = useRef(false)

  const { fetchPlans, loading: plansLoading, cancelPending, hasApiKey } =
    useGeminiMalaysianPlans()

  const runPlanSearch = useCallback(async (nameOverride) => {
    const name = (nameOverride ?? form.name).trim()
    if (name.length < 2) {
      setError('Enter at least 2 characters, then tap Find Plans.')
      return
    }

    setError('')
    setHasSearched(true)
    setSelectedPlanKey('')

    const result = await fetchPlans(name)

    if (fieldsTouchedRef.current) return

    setPlans(result.plans)

    if (result.plans.length > 0) {
      setManualMode(false)
      setHint(
        result.source === 'gemini'
          ? `Found ${result.plans.length} Malaysia plan(s) via AI — select one below`
          : `Found ${result.plans.length} plan(s) from catalog — select one below`
      )
    } else if (result.source === 'no_api') {
      setManualMode(true)
      setHint('')
      setError(result.errorMessage)
    } else {
      setManualMode(true)
      setHint('Enter plan, cost, and URL manually below.')
      if (result.errorMessage) setError(result.errorMessage)
    }
  }, [fetchPlans, form.name])

  useEffect(() => {
    if (!open) return
    setForm(emptyForm)
    setError('')
    setHint('')
    setPlans([])
    setSelectedPlanKey('')
    setManualMode(false)
    setAutoSearch(false)
    setHasSearched(false)
    fieldsTouchedRef.current = false
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
      cancelPending()
    }
  }, [open, onClose, cancelPending])

  useEffect(() => {
    if (!open || !autoSearch) return

    const name = form.name.trim()
    if (name.length < 2) return

    const timer = window.setTimeout(() => {
      runPlanSearch(name)
    }, 900)

    return () => window.clearTimeout(timer)
  }, [form.name, autoSearch, open, runPlanSearch])

  if (!open) return null

  function resetDerivedFields() {
    setPlans([])
    setSelectedPlanKey('')
    setManualMode(false)
    setHasSearched(false)
    fieldsTouchedRef.current = false
    setHint('')
    setForm((prev) => ({ ...prev, plan: '', cost: '', url: '' }))
  }

  function setField(field, value) {
    if (field === 'name') {
      resetDerivedFields()
      setForm((prev) => ({ ...prev, name: value }))
    } else {
      fieldsTouchedRef.current = true
      setForm((prev) => ({ ...prev, [field]: value }))
    }
    setError('')
  }

  function applyPlan(plan) {
    fieldsTouchedRef.current = false
    setForm((prev) => ({
      ...prev,
      plan: plan.name,
      cost: String(plan.monthlyRM),
      url: plan.cancelUrl,
    }))
    setHint('Plan applied — cost and cancel URL filled in')
  }

  function handlePlanSelect(key) {
    setSelectedPlanKey(key)
    setError('')

    if (key === MANUAL_PLAN_KEY || key === '') {
      setManualMode(true)
      if (key === MANUAL_PLAN_KEY) {
        fieldsTouchedRef.current = true
        setHint('Enter plan details manually')
      }
      return
    }

    setManualMode(false)
    const plan = plans.find((p) => p.id === key)
    if (plan) applyPlan(plan)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = form.name.trim()
    const plan = form.plan.trim() || 'Custom Plan'
    const cost = parseFloat(form.cost)
    const url = form.url.trim()

    if (!name) {
      setError('App name is required.')
      return
    }
    if (!form.cost || Number.isNaN(cost) || cost <= 0) {
      setError('Select a plan or enter a valid monthly cost.')
      return
    }
    if (!url) {
      setError('Tap Find Plans and select a plan, or paste the cancellation URL.')
      return
    }

    onAdd({
      id: `custom-${Date.now()}`,
      name,
      plan,
      cost,
      description: 'Custom subscription',
      url,
      isCustom: true,
      ...CUSTOM_SUBSCRIPTION_STYLE,
    })
    onClose()
  }

  const nameReady = form.name.trim().length >= 2
  const showPlanDropdown = hasSearched && nameReady
  const showManualFields =
    manualMode || !hasApiKey || (hasSearched && plans.length === 0 && !plansLoading)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-sub-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="glass-card rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md border border-zinc-800/90 shadow-2xl max-h-[92vh] flex flex-col"
        style={{ animation: 'modal-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
              <Plus size={16} className="text-rose-400" />
            </div>
            <div>
              <h2 id="add-sub-title" className="font-display font-bold text-white text-base">
                Add Subscription
              </h2>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
                Track a new leak
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {!hasApiKey && (
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-200/80 font-body leading-snug">
                No Gemini API key detected. Copy <span className="font-mono">.env.example</span> to{' '}
                <span className="font-mono">.env</span>, add your key, then restart{' '}
                <span className="font-mono">npm run dev</span>.
              </p>
            </div>
          )}

          <div>
            <FieldLabel icon={AppWindow}>App Name</FieldLabel>
            <div className="flex gap-2">
              <AppNameCombobox
                value={form.name}
                onChange={(name) => setField('name', name)}
                onSelectApp={(app) => runPlanSearch(app.name)}
                onSubmitSearch={() => runPlanSearch()}
                disabled={plansLoading}
                loading={plansLoading}
              />
              <button
                type="button"
                onClick={() => runPlanSearch()}
                disabled={!nameReady || plansLoading}
                className="flex-shrink-0 px-3.5 rounded-xl bg-violet-500/15 border border-violet-500/35 text-violet-300 hover:bg-violet-500/25 hover:text-violet-200 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wide"
                aria-label="Find subscription plans"
              >
                {plansLoading
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Search size={14} />
                }
                <span className="hidden sm:inline">Find Plans</span>
              </button>
            </div>

            <label className="mt-2.5 flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSearch}
                onChange={(e) => setAutoSearch(e.target.checked)}
                disabled={!hasApiKey}
                className="w-3.5 h-3.5 rounded border-zinc-600 bg-white/5 accent-violet-500 disabled:opacity-40"
              />
              <span className="text-[10px] font-mono text-white/35 uppercase tracking-wider">
                Auto-search while typing
              </span>
            </label>

            <p className="text-[10px] font-mono text-white/30 mt-1.5 leading-snug">
              Dropdown lists apps with subscription plans only. Custom names still work via Find Plans.
            </p>
          </div>

          {showPlanDropdown && (
            <div>
              <FieldLabel icon={Tag}>Plan (Malaysia)</FieldLabel>
              <PlanSelectDropdown
                plans={plans}
                value={selectedPlanKey}
                onChange={handlePlanSelect}
                loading={plansLoading}
              />
            </div>
          )}

          {(showManualFields || selectedPlanKey === MANUAL_PLAN_KEY) && (
            <div>
              <FieldLabel icon={Tag}>Plan Type</FieldLabel>
              <input
                type="text"
                value={form.plan}
                onChange={(e) => setField('plan', e.target.value)}
                placeholder="e.g. All Apps Student"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <FieldLabel icon={Wallet}>Monthly Cost (RM)</FieldLabel>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.cost}
              onChange={(e) => setField('cost', e.target.value)}
              placeholder={plansLoading ? 'Searching…' : '9.50'}
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>

          <div>
            <FieldLabel icon={Link}>Cancellation URL</FieldLabel>
            <div className="relative">
              <input
                type="url"
                value={form.url}
                onChange={(e) => setField('url', e.target.value)}
                placeholder={plansLoading ? 'Searching…' : 'https://...'}
                className={`${inputClass} pr-9 font-mono text-xs ${plansLoading ? 'opacity-70' : ''}`}
              />
              {plansLoading && (
                <Loader2
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 animate-spin pointer-events-none"
                />
              )}
            </div>
          </div>

          {hint && (
            <p className="text-[10px] font-mono text-emerald-400/70 leading-snug -mt-2">
              {hint}
            </p>
          )}

          {error && (
            <p className="text-xs text-rose-400 font-mono flex items-start gap-1.5" role="alert">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-display font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={plansLoading}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white text-sm font-display font-bold transition-colors shadow-lg shadow-rose-500/20"
            >
              Add to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
