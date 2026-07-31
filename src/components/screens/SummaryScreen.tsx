import type { GameSession } from "../../types"
import AuditTrail from "../AuditTrail"
import ScreenHeader from "../ScreenHeader"
import { getPlayerTotalBuyIn } from "../../utils/buyIns"

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
    profitLoss: (Number(player.finalAmount) || 0) - getPlayerTotalBuyIn(player)
  })).sort((a, b) => b.profitLoss - a.profitLoss)

  const winners = playersWithPL.filter(p => p.profitLoss > 0)
  const breakEven = playersWithPL.filter(p => p.profitLoss === 0)
  const losers = playersWithPL.filter(p => p.profitLoss < 0)

  return (
    <div className="min-h-screen bg-app p-4">
      <div className="max-w-md mx-auto">
        <ScreenHeader
          title="Summary"
          subtitle={`${formatCurrency(session.buyInAmount)} • ${session.players.length} players`}
        />

        {winners.length > 0 && (
          <div className="mb-4">
            <h2 className="text-success text-sm mb-2">🏆 Winners</h2>
            <div className="space-y-1">
              {winners.map((player) => (
                <div key={player.id} className="bg-surface rounded-app border border-border p-2 flex justify-between items-center">
                  <span className="text-fg text-sm">{player.name}</span>
                  <span className="text-success text-sm font-mono">+{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {losers.length > 0 && (
          <div className="mb-4">
            <h2 className="text-danger text-sm mb-2">📉 Losses</h2>
            <div className="space-y-1">
              {losers.map((player) => (
                <div key={player.id} className="bg-surface rounded-app border border-border p-2 flex justify-between items-center">
                  <span className="text-fg text-sm">{player.name}</span>
                  <span className="text-danger text-sm font-mono">{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {breakEven.length > 0 && (
          <div className="mb-4">
            <h2 className="text-fg-muted text-sm mb-2">⚖️ Break Even</h2>
            <div className="space-y-1">
              {breakEven.map((player) => (
                <div key={player.id} className="bg-surface rounded-app border border-border p-2 flex justify-between items-center">
                  <span className="text-fg text-sm">{player.name}</span>
                  <span className="text-fg-muted text-sm font-mono">$0.00</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface rounded-app border border-border p-3 mb-6">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-fg-muted">Total Pot:</span>
              <span className="text-fg">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Buy-ins:</span>
              <span className="text-fg">{session.players.reduce((sum, p) => sum + p.buyInAmounts.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Winner:</span>
              <span className="text-success">{winners[0]?.name || 'None'}</span>
            </div>
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
            onClick={onNewGame}
            className="flex-1 rounded-[10px] bg-accent py-3 text-sm font-semibold text-accent-contrast hover:opacity-90"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}