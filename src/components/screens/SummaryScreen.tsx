import type { GameSession } from '../../types'
import AuditTrail from '../AuditTrail'
import ScreenHeader from '../ScreenHeader'
import AppShell from '../AppShell'
import { getPlayerTotalBuyIn } from '../../utils/buyIns'

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
    <AppShell
      header={(
        <ScreenHeader
          title="Summary"
          subtitle={`${formatCurrency(session.buyInAmount)} · ${session.players.length} players`}
        />
      )}
      footer={(
        <div className="actions">
          <button
            type="button"
            onClick={onNewGame}
            className="btn btn-primary"
          >
            New game
          </button>
          <button
            type="button"
            onClick={onGoBack}
            className="btn btn-secondary"
          >
            Back
          </button>
        </div>
      )}
    >
      <div className="stage-scroll">
        {winners.length > 0 && (
          <section>
            <p className="section-label mb-2">Winners</p>
            <div className="flex flex-col gap-2">
              {winners.map((player) => (
                <div key={player.id} className="surface-card flex items-center justify-between">
                  <span className="text-sm text-fg">{player.name}</span>
                  <span className="text-sm font-mono text-success">+{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {losers.length > 0 && (
          <section>
            <p className="section-label mb-2">Losses</p>
            <div className="flex flex-col gap-2">
              {losers.map((player) => (
                <div key={player.id} className="surface-card flex items-center justify-between">
                  <span className="text-sm text-fg">{player.name}</span>
                  <span className="text-sm font-mono text-danger">{formatCurrency(player.profitLoss)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {breakEven.length > 0 && (
          <section>
            <p className="section-label mb-2">Break even</p>
            <div className="flex flex-col gap-2">
              {breakEven.map((player) => (
                <div key={player.id} className="surface-card flex items-center justify-between">
                  <span className="text-sm text-fg">{player.name}</span>
                  <span className="text-sm font-mono text-fg-muted">$0.00</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="surface-card">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-fg-secondary">Total pot:</span>
              <span className="text-fg">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-secondary">Buy-ins:</span>
              <span className="text-fg">{session.players.reduce((sum, p) => sum + p.buyInAmounts.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-secondary">Top winner:</span>
              <span className="text-success">{winners[0]?.name || 'None'}</span>
            </div>
          </div>
        </div>

        <AuditTrail
          auditTrail={session.auditTrail}
          formatCurrency={formatCurrency}
          defaultCollapsed={true}
        />
      </div>
    </AppShell>
  )
}
