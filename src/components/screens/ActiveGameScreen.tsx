import type { GameSession } from "../../types"
import PlayerCard from "../PlayerCard"
import AuditTrail from "../AuditTrail"
import ScreenHeader from "../ScreenHeader"

interface ActiveGameScreenProps {
  session: GameSession
  newPlayerName: string
  setNewPlayerName: (name: string) => void
  onAddPlayer: () => void
  onUpdateBuyIns: (playerId: string, change: number) => void
  onAddCustomBuyIn: (playerId: string, amount: number) => void
  onRemovePlayer: (playerId: string) => void
  onGoToLedger: () => void
  onReset: () => void
  formatCurrency: (amount: number) => string
}

export default function ActiveGameScreen({
  session,
  newPlayerName,
  setNewPlayerName,
  onAddPlayer,
  onUpdateBuyIns,
  onAddCustomBuyIn,
  onRemovePlayer,
  onGoToLedger,
  onReset,
  formatCurrency
}: ActiveGameScreenProps) {
  return (
    <div className="min-h-screen bg-app p-4">
      <div className="max-w-md mx-auto">
        <ScreenHeader
          title="Game"
          subtitle={`${formatCurrency(session.buyInAmount)} buy-in`}
        />

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            onKeyDown={(e) => e.key === 'Enter' && onAddPlayer()}
            className="flex-1 px-3 py-2 bg-surface text-fg rounded-app border border-border placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
          <button
            onClick={onAddPlayer}
            disabled={!newPlayerName.trim()}
            className="rounded-[10px] bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast hover:opacity-90 disabled:bg-inset disabled:text-fg-muted"
          >
            Add
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {session.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              buyInAmount={session.buyInAmount}
              onUpdateBuyIns={onUpdateBuyIns}
              onAddCustomBuyIn={onAddCustomBuyIn}
              onRemove={onRemovePlayer}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>

        <div className="mb-6">
          <AuditTrail
            auditTrail={session.auditTrail}
            formatCurrency={formatCurrency}
            defaultCollapsed={true}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 rounded-[10px] border border-border bg-surface py-3 text-sm font-medium text-fg hover:bg-inset"
          >
            Reset
          </button>
          <button
            onClick={onGoToLedger}
            disabled={session.players.length === 0}
            className="flex-1 rounded-[10px] bg-accent py-3 text-sm font-semibold text-accent-contrast hover:opacity-90 disabled:bg-inset disabled:text-fg-muted"
          >
            Count
          </button>
        </div>
      </div>
    </div>
  )
}