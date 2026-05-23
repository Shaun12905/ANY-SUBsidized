// ─── src/App.jsx ─────────────────────────────────────────────────────────────
// Root component — unified profile + dynamic subscriptions state.

import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_PROFILE, INITIAL_SUBSCRIPTIONS } from './data/subscriptions'
import EconomyHeader from './components/EconomyHeader'
import SubscriptionCard from './components/SubscriptionCard'
import KillSwitchModal from './components/KillSwitchModal'
import SettingsDrawer from './components/SettingsDrawer'
import AddSubscriptionCard from './components/AddSubscriptionCard'
import AddSubscriptionModal from './components/AddSubscriptionModal'

export default function App() {
  const [profile, setProfile] = useState(() => ({ ...DEFAULT_PROFILE }))
  const [subscriptions, setSubscriptions] = useState(() => [...INITIAL_SUBSCRIPTIONS])
  const [removingIds, setRemovingIds] = useState(() => new Set())
  const [modalSub, setModalSub] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const normalizedProfile = useMemo(
    () => ({
      university: profile.university?.trim() || DEFAULT_PROFILE.university,
      allowance: typeof profile.allowance === 'number' && profile.allowance > 0
        ? profile.allowance
        : DEFAULT_PROFILE.allowance,
      mealCost: typeof profile.mealCost === 'number' && profile.mealCost > 0
        ? profile.mealCost
        : DEFAULT_PROFILE.mealCost,
    }),
    [profile]
  )

  const handleKillSwitch = useCallback((subscription) => {
    setModalSub(subscription)
  }, [])

  const handleConfirmKill = useCallback((id) => {
    setRemovingIds((prev) => new Set([...prev, id]))
    setModalSub(null)

    window.setTimeout(() => {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 480)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalSub(null)
  }, [])

  const handleAddSubscription = useCallback((entry) => {
    setSubscriptions((prev) => [...prev, entry])
  }, [])

  const totalSavedYearly = INITIAL_SUBSCRIPTIONS.reduce((sum, s) => sum + s.cost * 12, 0)

  return (
    <div className="relative min-h-screen z-10">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

        <EconomyHeader
          profile={normalizedProfile}
          subscriptions={subscriptions}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                mealCost={normalizedProfile.mealCost}
                isRemoving={removingIds.has(subscription.id)}
                onKillSwitch={handleKillSwitch}
              />
            ))}
            <AddSubscriptionCard onClick={() => setAddModalOpen(true)} />
          </div>

          {subscriptions.length === 0 && (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-display font-bold text-emerald-400 text-base">
                You killed all subscriptions!
              </p>
              <p className="text-xs text-white/40 font-body mt-1">
                That&apos;s up to RM{totalSavedYearly.toFixed(2)} saved per year.
                Go buy some chicken rice.
              </p>
            </div>
          )}
        </main>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-mono text-white/15 uppercase tracking-widest">
            SUBsidized — built for Malaysian students on a budget
          </p>
          <p className="text-[9px] font-mono text-white/10 mt-1">
            AI scripts powered by Gemini 1.5 Flash • .ics via Blob API • No server required
          </p>
        </footer>
      </div>

      {modalSub && (
        <KillSwitchModal
          subscription={modalSub}
          profile={normalizedProfile}
          onClose={handleCloseModal}
          onConfirmKill={handleConfirmKill}
        />
      )}

      <SettingsDrawer
        open={settingsOpen}
        profile={profile}
        onProfileChange={setProfile}
        onClose={() => setSettingsOpen(false)}
      />

      <AddSubscriptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />
    </div>
  )
}
