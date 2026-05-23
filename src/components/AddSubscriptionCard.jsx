// ─── src/components/AddSubscriptionCard.jsx ──────────────────────────────────
// Dashed bento tile that opens the add-subscription form.

import { Plus } from 'lucide-react'

export default function AddSubscriptionCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl min-h-[220px] border-2 border-dashed border-zinc-700/80 hover:border-rose-500/40 bg-white/[0.02] hover:bg-rose-500/[0.03] transition-all duration-300 p-6 text-center w-full h-full"
      aria-label="Add custom subscription"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-zinc-700/80 group-hover:border-rose-500/30 flex items-center justify-center transition-colors">
        <Plus size={22} className="text-white/30 group-hover:text-rose-400 transition-colors" />
      </div>
      <div>
        <p className="font-display font-bold text-sm text-white/50 group-hover:text-white/80 transition-colors">
          Add Subscription
        </p>
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mt-1">
          Track a custom leak
        </p>
      </div>
    </button>
  )
}
