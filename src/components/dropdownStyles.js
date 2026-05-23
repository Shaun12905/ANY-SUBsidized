// ─── Shared cyber-dark dropdown tokens (app + plan pickers) ─────────────────

export const DROPDOWN_TRIGGER =
  'w-full rounded-xl bg-white/[0.04] border border-zinc-700/80 focus:border-rose-500/40 px-3 py-2.5 text-sm text-white font-body transition-colors outline-none pr-9 text-left'

export const DROPDOWN_TRIGGER_PLACEHOLDER = 'text-white/20'

export const DROPDOWN_PANEL =
  'absolute z-30 left-0 right-0 top-full mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-zinc-700/90 bg-slate-950 shadow-2xl py-1'

export const DROPDOWN_HEADER =
  'px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-white/25 border-b border-zinc-800/80'

export const DROPDOWN_EMPTY =
  'absolute z-30 left-0 right-0 top-full mt-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-slate-950 text-[10px] font-mono text-white/35'

export function dropdownItemClass(active) {
  return `w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-colors ${
    active
      ? 'bg-violet-500/15 text-white'
      : 'text-white/80 hover:bg-white/5'
  }`
}

export const DROPDOWN_ITEM_TITLE = 'block text-sm font-display font-semibold truncate'

export const DROPDOWN_ITEM_SUB =
  'block text-[10px] font-mono text-white/35 uppercase tracking-wider mt-0.5'

export const DROPDOWN_CHEVRON = (open) =>
  `absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
    open ? 'rotate-180 text-white/50' : 'text-white/25'
  }`
