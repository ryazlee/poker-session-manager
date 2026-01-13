import type { GameSession } from "../../types"

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
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg text-white mb-1">Summary</h1>
          <p className="text-gray-400 text-sm">{formatCurrency(session.buyInAmount)} • {session.players.length} players</p>
        </div>

        {winners.length > 0 && (
          <div className="mb-4">
            <h2 className="text-green-400 text-sm mb-2">🏆 Winners</h2>
            <div className="space-y-1">
              {winners.map((player) => (
                <div key={player.id} className="bg-gray-800 rounded p-2 flex justify-between items-center">
                  <span className="text-white text-sm">{player.name}</span>
                  <span className="text-green-400 text-sm font-mono">+{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {losers.length > 0 && (
          <div className="mb-4">
            <h2 className="text-red-400 text-sm mb-2">📉 Losses</h2>
            <div className="space-y-1">
              {losers.map((player) => (
                <div key={player.id} className="bg-gray-800 rounded p-2 flex justify-between items-center">
                  <span className="text-white text-sm">{player.name}</span>
                  <span className="text-red-400 text-sm font-mono">{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded p-3 mb-6">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Pot:</span>
              <span className="text-white">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Buy-ins:</span>
              <span className="text-white">{session.players.reduce((sum, p) => sum + p.buyIns, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Winner:</span>
              <span className="text-green-400">{winners[0]?.name || 'None'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onGoBack}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
          >
            Back
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 py-3 bg-white hover:bg-gray-100 text-black rounded text-sm font-medium"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}