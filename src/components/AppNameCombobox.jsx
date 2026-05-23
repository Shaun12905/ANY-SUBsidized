// ─── src/components/AppNameCombobox.jsx ────────────────────────────────────────
// App name input with live-filtered subscription directory dropdown.

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { searchSubscriptionApps } from '../data/subscriptionApps'
import {
  DROPDOWN_TRIGGER,
  DROPDOWN_PANEL,
  DROPDOWN_HEADER,
  DROPDOWN_EMPTY,
  dropdownItemClass,
  DROPDOWN_ITEM_TITLE,
  DROPDOWN_ITEM_SUB,
  DROPDOWN_CHEVRON,
} from './dropdownStyles'

export default function AppNameCombobox({
  value,
  onChange,
  onSelectApp,
  onSubmitSearch,
  disabled = false,
  loading = false,
}) {
  const listId = useId()
  const wrapperRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const suggestions = searchSubscriptionApps(value, 10)

  useEffect(() => {
    setHighlight(0)
  }, [value, open])

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function pickApp(app) {
    onChange(app.name)
    setOpen(false)
    onSelectApp?.(app)
  }

  function handleKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && suggestions.length > 0) {
        e.preventDefault()
        pickApp(suggestions[highlight])
      } else {
        onSubmitSearch?.()
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && suggestions.length > 0 && !disabled

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-0">
      <input
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Spotify, Adobe, Netflix…"
        className={`${DROPDOWN_TRIGGER} placeholder:text-white/20`}
        disabled={disabled}
        autoComplete="off"
      />
      <ChevronDown size={14} className={DROPDOWN_CHEVRON(showList)} />

      {showList && (
        <ul id={listId} role="listbox" className={DROPDOWN_PANEL}>
          <li className={DROPDOWN_HEADER}>
            {value.trim() ? 'Subscriptions with plans in MY' : 'Apps with subscription plans'}
          </li>
          {suggestions.map((app, i) => (
            <li key={app.name} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pickApp(app)}
                className={dropdownItemClass(i === highlight)}
              >
                <div className="min-w-0">
                  <span className={DROPDOWN_ITEM_TITLE}>{app.name}</span>
                  <span className={DROPDOWN_ITEM_SUB}>
                    {app.category}
                    <span className="text-violet-400/80 normal-case tracking-normal">
                      {' · '}{app.planCount} plan{app.planCount === 1 ? '' : 's'} available
                    </span>
                  </span>
                </div>
                <Sparkles size={12} className="text-violet-400/50 flex-shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && value.trim().length >= 1 && suggestions.length === 0 && (
        <p className={DROPDOWN_EMPTY}>
          No subscription app matched — try Spotify, Netflix, Adobe, or type a custom name and use Find Plans
        </p>
      )}
    </div>
  )
}
