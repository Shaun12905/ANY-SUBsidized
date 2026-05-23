// ─── src/components/SmartSwap.jsx ────────────────────────────────────────────
// Animates in below a card when that subscription is cancelled.
// Suggests a 100% free / open-source alternative.

import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react'

export default function SmartSwap({ swap }) {
  if (!swap) return null

  return (
    <div className="swap-reveal border-t border-white/5 px-4">
      <div className="flex items-start gap-3 py-4">
        {/* Icon badge */}
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={14} className="text-emerald-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              Smart Swap →
            </p>
            <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded px-1.5 py-0.5 uppercase tracking-wider">
              {swap.badge}
            </span>
          </div>

          <p className="text-sm font-display font-semibold text-white leading-tight">
            {swap.name}
          </p>
          <p className="text-xs text-white/40 font-body mt-0.5 leading-snug">
            {swap.tagline}
          </p>
        </div>

        {/* Open link */}
        <a
          href={swap.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex-shrink-0 mt-1 group"
          aria-label={`Open ${swap.name}`}
        >
          <span className="hidden sm:inline">Open</span>
          <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  )
}
