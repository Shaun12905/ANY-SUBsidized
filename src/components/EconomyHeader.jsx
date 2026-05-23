// ─── src/components/EconomyHeader.jsx ────────────────────────────────────────
// Student persona + live financial counters bound to profile & subscriptions.

import { useEffect, useRef, useState } from 'react'
import { GraduationCap, Wallet, TrendingDown, Calendar, Settings } from 'lucide-react'

function AnimatedAmount({ value, prefix = 'RM', decimals = 2, suffix = '' }) {
  const [display, setDisplay] = useState(value)
  const [rolling, setRolling] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value) {
      setRolling(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRolling(true)
          setDisplay(value)
          prevRef.current = value
        })
      })
    }
  }, [value])

  return (
    <span
      className={`inline-block font-mono font-semibold tabular-nums ${rolling ? 'roll-up' : ''}`}
    >
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}

function StatTile({ icon: Icon, label, value, valueClass = '', suffix = '' }) {
  return (
    <div className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 flex-1 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-white/60" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 truncate">
          {label}
        </p>
        <p className={`text-sm font-display font-bold leading-tight overflow-hidden min-h-[1.25rem] ${valueClass}`}>
          {value}{suffix}
        </p>
      </div>
    </div>
  )
}

export default function EconomyHeader({ profile, subscriptions, onOpenSettings }) {
  const monthlyLeak = subscriptions.reduce((sum, s) => sum + s.cost, 0)
  const yearlyImpact = monthlyLeak * 12
  const leakPercent = profile.allowance > 0
    ? (monthlyLeak / profile.allowance) * 100
    : 0

  return (
    <header className="relative z-10 mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <span className="font-display font-black text-rose-400 text-xl leading-none">$</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping opacity-60" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-white tracking-tight leading-none">
              SUB<span className="text-rose-400">sidized</span>
            </h1>
            <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-0.5">
              Kill your subscriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 min-w-0">
            <GraduationCap size={13} className="text-white/50 flex-shrink-0" />
            <span className="text-xs text-white/60 font-body truncate max-w-[140px] sm:max-w-[200px]">
              {profile.university || 'Your University'}
            </span>
            <span className="w-px h-3 bg-white/15 flex-shrink-0" />
            <Wallet size={13} className="text-white/50 flex-shrink-0" />
            <span className="text-xs font-mono text-white/60 tabular-nums whitespace-nowrap">
              RM{profile.allowance}/mo
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full glass-card border border-zinc-700/80 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-200 flex-shrink-0"
            aria-label="Open profile settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatTile
          icon={TrendingDown}
          label="Monthly Leak"
          value={<AnimatedAmount value={monthlyLeak} />}
          valueClass="text-rose-400"
        />
        <StatTile
          icon={Calendar}
          label="Yearly Impact"
          value={<AnimatedAmount value={yearlyImpact} />}
          valueClass="text-orange-400"
        />
        <StatTile
          icon={Wallet}
          label="% of Allowance"
          value={<AnimatedAmount value={leakPercent} decimals={1} prefix="" />}
          valueClass="text-amber-400"
          suffix="%"
        />
        <StatTile
          icon={GraduationCap}
          label="Meal Cost"
          value={<AnimatedAmount value={profile.mealCost} />}
          valueClass="text-emerald-400"
          suffix="/plate"
        />
      </div>

      {monthlyLeak > 0 && (
        <div className="mt-3">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(leakPercent, 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-white/20 mt-1 text-right tabular-nums">
            {leakPercent.toFixed(1)}% of allowance leaking to subscriptions
          </p>
        </div>
      )}
    </header>
  )
}
