import type { GameSession } from '../types'
import PlayerCard from './PlayerCard'

interface ActiveGameScreenProps {
  session: GameSession
  newPlayerName: string
  setNewPlayerName: (name: string) => void
  onAddPlayer: () => void
  onUpdateBuyIns: (playerId: string, change: number) => void
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
  onRemovePlayer,
  onGoToLedger,
  onReset,
  formatCurrency
}: ActiveGameScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg font-medium text-white mb-1">🃏 Active Game</h1>
          <p className="text-slate-400">Buy-in: {formatCurrency(session.buyInAmount)}</p>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            onKeyPress={(e) => e.key === 'Enter' && onAddPlayer()}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <button
            onClick={onAddPlayer}
            disabled={!newPlayerName.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors touch-manipulation"
          >
            Add
          </button>
        </div>

        <div className="space-y-3 mb-8">
          {session.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              buyInAmount={session.buyInAmount}
              onUpdateBuyIns={onUpdateBuyIns}
              onRemove={onRemovePlayer}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 border border-white/20 text-white rounded-lg font-medium transition-colors touch-manipulation"
          >
            Reset
          </button>
          <button
            onClick={onGoToLedger}
            disabled={session.players.length === 0}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors touch-manipulation"
          >
            Final Count
          </button>
        </div>
      </div>
    </div>
  )
}