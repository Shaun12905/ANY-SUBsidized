// ─── src/components/PlanSelectDropdown.jsx ─────────────────────────────────────
// Plan picker — same cyber-dark dropdown styling as AppNameCombobox.

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Tag } from 'lucide-react'
import {
  DROPDOWN_TRIGGER,
  DROPDOWN_TRIGGER_PLACEHOLDER,
  DROPDOWN_PANEL,
  DROPDOWN_HEADER,
  DROPDOWN_EMPTY,
  dropdownItemClass,
  DROPDOWN_ITEM_TITLE,
  DROPDOWN_ITEM_SUB,
  DROPDOWN_CHEVRON,
} from './dropdownStyles'

export const MANUAL_PLAN_KEY = '__manual__'

export default function PlanSelectDropdown({
  plans,
  value,
  onChange,
  loading = false,
  disabled = false,
}) {
  const listId = useId()
  const wrapperRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const options = [
    ...plans.map((p) => ({
      id: p.id,
      title: p.name,
      subtitle: `RM${p.monthlyRM.toFixed(2)} / month`,
    })),
    {
      id: MANUAL_PLAN_KEY,
      title: 'Custom / enter manually',
      subtitle: 'Set plan, cost & URL yourself',
    },
  ]

  const selected = options.find((o) => o.id === value)
  const placeholder = loading
    ? 'Searching…'
    : plans.length
      ? 'Select a plan…'
      : 'No plans found'

  const triggerLabel = selected?.title ?? placeholder
  const isPlaceholder = !selected

  useEffect(() => {
    setHighlight(0)
  }, [value, open, plans.length])

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function pick(id) {
    onChange(id)
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (disabled || loading) return

    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && open && options.length > 0) {
      e.preventDefault()
      pick(options[highlight].id)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && options.length > 0 && !disabled && !loading

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        disabled={disabled || loading}
        onClick={() => !disabled && !loading && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`${DROPDOWN_TRIGGER} ${
          isPlaceholder ? DROPDOWN_TRIGGER_PLACEHOLDER : ''
        } ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="block truncate pr-2">{triggerLabel}</span>
      </button>
      <ChevronDown size={14} className={DROPDOWN_CHEVRON(showList)} />

      {showList && (
        <ul id={listId} role="listbox" className={DROPDOWN_PANEL}>
          <li className={DROPDOWN_HEADER}>Malaysia plans</li>
          {options.map((opt, i) => (
            <li key={opt.id} role="option" aria-selected={value === opt.id}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pick(opt.id)}
                className={dropdownItemClass(i === highlight || value === opt.id)}
              >
                <div className="min-w-0">
                  <span className={DROPDOWN_ITEM_TITLE}>{opt.title}</span>
                  <span className={DROPDOWN_ITEM_SUB}>{opt.subtitle}</span>
                </div>
                {opt.id !== MANUAL_PLAN_KEY && (
                  <Tag size={12} className="text-violet-400/50 flex-shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && options.length === 0 && (
        <p className={DROPDOWN_EMPTY}>Find plans first to see options here</p>
      )}
    </div>
  )
}
