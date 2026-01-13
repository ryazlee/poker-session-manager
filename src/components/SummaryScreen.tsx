import type { GameSession } from '../types'

interface SummaryScreenProps {
  session: GameSession
  onGoBack: () => void
  onNewGame: () => void
  formatCurrency: (amount: number) => string
  calculateTotals: () => { totalBuyIns: number, totalFinal: number, difference: number }
}

export default function SummaryScreen({
  session,
  onGoBack,
  onNewGame,
  formatCurrency,
  calculateTotals
}: SummaryScreenProps) {
  const totals = calculateTotals()
  const playersWithPL = session.players.map(player => ({
    ...player,
    profitLoss: (player.finalAmount || 0) - (player.buyIns * session.buyInAmount)
  })).sort((a, b) => b.profitLoss - a.profitLoss)

  const winners = playersWithPL.filter(p => p.profitLoss > 0)
  const losers = playersWithPL.filter(p => p.profitLoss < 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg font-medium text-white mb-1">📊 Session Summary</h1>
          <p className="text-slate-400">{formatCurrency(session.buyInAmount)} buy-in • {session.players.length} players</p>
        </div>

        {winners.length > 0 && (
          <div className="mb-6">
            <h2 className="text-green-400 font-medium mb-3 flex items-center">
              <span className="mr-2">🏆</span>
              Winners
            </h2>
            <div className="space-y-2">
              {winners.map((player) => (
                <div key={player.id} className="bg-green-900/20 border border-green-500/20 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-white font-medium">{player.name}</span>
                  <span className="text-green-400 font-mono">+{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {losers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-red-400 font-medium mb-3 flex items-center">
              <span className="mr-2">📉</span>
              Net Loss
            </h2>
            <div className="space-y-2">
              {losers.map((player) => (
                <div key={player.id} className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-white font-medium">{player.name}</span>
                  <span className="text-red-400 font-mono">{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-3">Game Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Pot:</span>
              <span className="text-white">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Buy-ins:</span>
              <span className="text-white">{session.players.reduce((sum, p) => sum + p.buyIns, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Buy-ins:</span>
              <span className="text-white">{(session.players.reduce((sum, p) => sum + p.buyIns, 0) / session.players.length).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Biggest Winner:</span>
              <span className="text-green-400">{winners[0]?.name || 'None'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onGoBack}
            className="flex-1 py-3 border border-white/20 text-white rounded-lg font-medium transition-colors touch-manipulation"
          >
            Back
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors touch-manipulation"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}