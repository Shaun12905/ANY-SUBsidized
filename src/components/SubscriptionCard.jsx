// ─── src/components/SubscriptionCard.jsx ─────────────────────────────────────
// Single subscription bento card — bound to dynamic cost & mealCost.

import { useState } from 'react'
import { AppWindow, CalendarClock, Zap } from 'lucide-react'
import RealityToggle from './RealityToggle'
import { downloadICS } from '../utils/icsGenerator'

function CalendarTooltip({ visible }) {
  if (!visible) return null
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-slate-800 border border-white/10 text-white/70 text-[9px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none z-20 uppercase tracking-wider">
      Download .ics reminder
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
    </div>
  )
}

export default function SubscriptionCard({
  subscription,
  mealCost,
  isRemoving,
  onKillSwitch,
}) {
  const [calHover, setCalHover] = useState(false)
  const [icsFlash, setIcsFlash] = useState(false)

  const Icon = subscription.icon || AppWindow
  const isActive = !isRemoving

  function handleCalendar(e) {
    e.stopPropagation()
    downloadICS(subscription)
    setIcsFlash(true)
    window.setTimeout(() => setIcsFlash(false), 1200)
  }

  return (
    <article
      className={`
        relative flex flex-col rounded-2xl overflow-hidden
        glass-card border ${subscription.borderClass || 'border-white/5'}
        ${isActive ? `shadow-lg ${subscription.glowClass || ''}` : ''}
        ${isRemoving ? 'card-removing' : 'transition-all duration-500 ease-out'}
      `}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
          isActive
            ? `bg-gradient-to-r from-transparent via-current to-transparent ${subscription.accentClass}`
            : 'bg-white/10'
        }`}
      />

      <div className="p-4 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 border border-white/15'
                  : 'bg-white/5 border border-white/5'
              }`}
            >
              <Icon
                size={18}
                style={{ color: isActive ? subscription.color : undefined }}
                className={isActive ? '' : 'text-white/25'}
              />
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-white leading-tight">
                {subscription.name}
              </h3>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
                {subscription.plan}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleCalendar}
              onMouseEnter={() => setCalHover(true)}
              onMouseLeave={() => setCalHover(false)}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${icsFlash
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border border-white/8 text-white/30 hover:bg-white/10 hover:text-white/70 hover:border-white/15'
                }
              `}
              aria-label={`Download ICS reminder for ${subscription.name}`}
            >
              <CalendarClock size={13} />
            </button>
            <CalendarTooltip visible={calHover} />
          </div>
        </div>

        <RealityToggle
          cost={subscription.cost}
          mealCost={mealCost}
          accentClass={subscription.accentClass || 'text-slate-400'}
        />

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-white/30 font-body leading-snug flex-1">
            {subscription.description}
          </p>
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
              isActive
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                : 'bg-white/15'
            }`}
            aria-hidden
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onKillSwitch(subscription)}
          disabled={!isActive}
          className={`
            w-full py-2.5 rounded-xl flex items-center justify-center gap-2
            text-xs font-display font-bold uppercase tracking-wider
            transition-all duration-200 group
            ${isActive
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20'
              : 'bg-white/5 border border-white/8 text-white/20 cursor-not-allowed opacity-50'
            }
          `}
          aria-label={`Kill switch for ${subscription.name}`}
        >
          <Zap
            size={12}
            className={`transition-transform ${isActive ? 'group-hover:scale-110' : ''}`}
          />
          Kill Switch
        </button>
      </div>
    </article>
  )
}
