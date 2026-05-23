// ─── src/components/RealityToggle.jsx ────────────────────────────────────────
// Fixed-height container — RM price ↔ meal plates (CSS keyframes, no layout shift).

import { Utensils } from 'lucide-react'

export default function RealityToggle({ cost, mealCost, accentClass }) {
  const safeMealCost = mealCost > 0 ? mealCost : 10
  const plates = (cost / safeMealCost).toFixed(1)

  return (
    <div className="relative h-14 w-full overflow-hidden select-none">
      <div className="reality-phase-a absolute inset-0 flex flex-col justify-center">
        <span className={`font-display font-black text-2xl leading-tight tabular-nums ${accentClass}`}>
          RM{cost.toFixed(2)}
        </span>
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
          per month
        </span>
      </div>

      <div className="reality-phase-b absolute inset-0 flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <Utensils size={12} className="text-white/40 mb-0.5 flex-shrink-0" />
          <span className="font-display font-black text-2xl leading-tight text-white tabular-nums">
            {plates}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-0.5">
          plates of chicken rice
        </span>
      </div>
    </div>
  )
}
