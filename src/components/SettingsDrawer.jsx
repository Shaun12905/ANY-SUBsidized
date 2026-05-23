// ─── src/components/SettingsDrawer.jsx ───────────────────────────────────────
// Sliding sidebar for editing the student's economic profile.

import { useEffect } from 'react'
import { X, Settings, GraduationCap, Wallet, Utensils } from 'lucide-react'

function FieldLabel({ icon: Icon, children }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
      <Icon size={11} className="text-white/30" />
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl bg-white/[0.04] border border-zinc-700/80 focus:border-rose-500/40 focus:bg-white/[0.06] px-3 py-2.5 text-sm text-white font-body placeholder:text-white/20 transition-colors outline-none'

export default function SettingsDrawer({ open, profile, onProfileChange, onClose }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  if (!open) return null

  function update(field, rawValue, type = 'text') {
    let value = rawValue
    if (type === 'number') {
      const parsed = parseFloat(rawValue)
      value = rawValue === '' || Number.isNaN(parsed) ? '' : parsed
    }
    onProfileChange({ ...profile, [field]: value })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Profile settings">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 modal-backdrop drawer-backdrop-enter"
        onClick={onClose}
        aria-label="Close settings"
      />

      <aside
        className="relative w-full max-w-sm h-full bg-slate-950 border-l border-zinc-800/90 shadow-2xl flex flex-col drawer-panel-enter"
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-zinc-700/80 flex items-center justify-center">
              <Settings size={16} className="text-white/60" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base leading-tight">
                Economic Profile
              </h2>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
                Settings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-zinc-800 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            aria-label="Close settings"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <FieldLabel icon={GraduationCap}>University Name</FieldLabel>
            <input
              type="text"
              value={profile.university}
              onChange={(e) => update('university', e.target.value)}
              placeholder="e.g. Sunway University"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel icon={Wallet}>Monthly Allowance (RM)</FieldLabel>
            <input
              type="number"
              min="0"
              step="1"
              value={profile.allowance === '' ? '' : profile.allowance}
              onChange={(e) => update('allowance', e.target.value, 'number')}
              placeholder="1000"
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>

          <div>
            <FieldLabel icon={Utensils}>Base Meal Cost / Plate (RM)</FieldLabel>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={profile.mealCost === '' ? '' : profile.mealCost}
              onChange={(e) => update('mealCost', e.target.value, 'number')}
              placeholder="10.00"
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>

          <p className="text-[11px] text-white/30 font-body leading-relaxed rounded-xl bg-white/[0.02] border border-zinc-800/60 p-3">
            Changes apply instantly across all leak calculations and meal-plate equivalents on every card.
          </p>
        </div>
      </aside>
    </div>
  )
}
