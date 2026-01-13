import type { GameSession } from '../types'
import LedgerRow from './LedgerRow'

interface LedgerScreenProps {
  session: GameSession
  onUpdateFinalAmount: (playerId: string, amount: string) => void
  onGoBack: () => void
  onGoToSummary: () => void
  formatCurrency: (amount: number) => string
  calculateTotals: () => { totalBuyIns: number, totalFinal: number, difference: number }
}

export default function LedgerScreen({
  session,
  onUpdateFinalAmount,
  onGoBack,
  onGoToSummary,
  formatCurrency,
  calculateTotals
}: LedgerScreenProps) {
  const totals = calculateTotals()
  const isBalanced = totals.difference < 0.01

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-lg font-medium text-white mb-1">🃏 Final Count</h1>
          <p className="text-slate-400">Buy-in: {formatCurrency(session.buyInAmount)}</p>
        </div>

        <div className="space-y-3 mb-6">
          {session.players.map((player) => (
            <LedgerRow
              key={player.id}
              player={player}
              buyInAmount={session.buyInAmount}
              onUpdateFinalAmount={onUpdateFinalAmount}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>

        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total In:</span>
              <span className="text-white">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Out:</span>
              <span className="text-white">{formatCurrency(totals.totalFinal)}</span>
            </div>
            <div className={`flex justify-between font-medium pt-2 border-t border-white/10 ${isBalanced ? 'text-green-400' : 'text-red-400'
              }`}>
              <span>Difference:</span>
              <span>{formatCurrency(totals.difference)}</span>
            </div>
          </div>
          <div className={`text-center mt-3 text-sm font-medium ${isBalanced ? 'text-green-400' : 'text-red-400'
            }`}>
            {isBalanced ? '✅ Balanced' : '⚠️ Check amounts'}
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
            onClick={onGoToSummary}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors touch-manipulation"
          >
            Summary
          </button>
        </div>
      </div>
    </div>
  )
}