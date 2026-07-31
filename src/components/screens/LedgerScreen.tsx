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
    <div className="min-h-screen bg-app p-4">
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

        <div className="bg-surface rounded-app border border-border p-3 mb-6">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">In:</span>
              <span className="text-fg">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Out:</span>
              <span className="text-fg">{formatCurrency(totals.totalFinal)}</span>
            </div>
            <div className={`flex justify-between font-medium pt-1 border-t border-border ${isBalanced ? 'text-success' : 'text-danger'
              }`}>
              <span>Diff:</span>
              <span>{formatCurrency(totals.difference)}</span>
            </div>
          </div>
          <div className={`text-center mt-2 text-xs ${isBalanced ? 'text-success' : 'text-danger'
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
            className="flex-1 rounded-[10px] border border-border bg-surface py-3 text-sm font-medium text-fg hover:bg-inset"
          >
            Back
          </button>
          <button
            onClick={onGoToSummary}
            className="flex-1 rounded-[10px] bg-accent py-3 text-sm font-semibold text-accent-contrast hover:opacity-90"
          >
            Summary
          </button>
        </div>
      </div>
    </div>
  )
}