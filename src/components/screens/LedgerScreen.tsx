import type { GameSession } from "../../types"
import AuditTrail from "../AuditTrail"
import LedgerRow from "../LedgerRow"
import ScreenHeader from "../ScreenHeader"

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
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <ScreenHeader
          title="Count"
          subtitle={`${formatCurrency(session.buyInAmount)} buy-in`}
        />

        <div className="space-y-2 mb-4">
          {session.players.map((player) => (
            <LedgerRow
              key={player.id}
              player={player}
              onUpdateFinalAmount={onUpdateFinalAmount}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>

        <div className="bg-gray-800 rounded p-3 mb-6">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">In:</span>
              <span className="text-white">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Out:</span>
              <span className="text-white">{formatCurrency(totals.totalFinal)}</span>
            </div>
            <div className={`flex justify-between font-medium pt-1 border-t border-gray-700 ${isBalanced ? 'text-green-400' : 'text-red-400'
              }`}>
              <span>Diff:</span>
              <span>{formatCurrency(totals.difference)}</span>
            </div>
          </div>
          <div className={`text-center mt-2 text-xs ${isBalanced ? 'text-green-400' : 'text-red-400'
            }`}>
            {isBalanced ? '✓ Balanced' : '⚠ Check amounts'}
          </div>
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
            onClick={onGoBack}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
          >
            Back
          </button>
          <button
            onClick={onGoToSummary}
            className="flex-1 py-3 bg-white hover:bg-gray-100 text-black rounded text-sm font-medium"
          >
            Summary
          </button>
        </div>
      </div>
    </div>
  )
}