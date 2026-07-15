import type { GameSession } from "../../types"
import PlayerCard from "../PlayerCard"
import AuditTrail from "../AuditTrail"

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
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg text-white mb-1">Game</h1>
          <p className="text-gray-400 text-sm">{formatCurrency(session.buyInAmount)} buy-in</p>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            onKeyDown={(e) => e.key === 'Enter' && onAddPlayer()}
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
          <button
            onClick={onAddPlayer}
            disabled={!newPlayerName.trim()}
            className="px-4 py-2 bg-white hover:bg-gray-100 disabled:bg-gray-700 text-black disabled:text-gray-500 rounded text-sm font-medium"
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
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
          >
            Reset
          </button>
          <button
            onClick={onGoToLedger}
            disabled={session.players.length === 0}
            className="flex-1 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-700 text-black disabled:text-gray-500 rounded text-sm font-medium"
          >
            Count
          </button>
        </div>
      </div>
    </div>
  )
}