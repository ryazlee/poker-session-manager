import type { GameSession } from '../../types'
import AuditTrail from '../AuditTrail'
import LedgerRow from '../LedgerRow'
import ScreenHeader from '../ScreenHeader'
import AppShell from '../AppShell'
import { getActivePlayers, getOutPlayers } from '../../utils/buyIns'

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
  const activePlayers = getActivePlayers(session)
  const outPlayers = getOutPlayers(session)

  return (
    <AppShell
      header={(
        <ScreenHeader
          title="Count"
          subtitle={`${formatCurrency(session.buyInAmount)} buy-in`}
        />
      )}
      footer={(
        <>
          <p className={`status ${isBalanced ? '' : 'error'}`}>
            {isBalanced ? 'Balanced' : `Off by ${formatCurrency(totals.difference)}`}
          </p>
          <div className="actions">
            <button
              type="button"
              onClick={onGoToSummary}
              className="btn btn-primary"
            >
              Summary
            </button>
            <button
              type="button"
              onClick={onGoBack}
              className="btn btn-secondary"
            >
              Back
            </button>
          </div>
        </>
      )}
    >
      <div className="stage-scroll">
        {outPlayers.length > 0 && (
          <section>
            <p className="section-label mb-2">Already out</p>
            <div className="flex flex-col gap-2">
              {outPlayers.map((player) => (
                <LedgerRow
                  key={player.id}
                  player={player}
                  onUpdateFinalAmount={onUpdateFinalAmount}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </section>
        )}

        {activePlayers.length > 0 && (
          <section>
            <p className="section-label mb-2">Still in</p>
            <div className="flex flex-col gap-2">
              {activePlayers.map((player) => (
                <LedgerRow
                  key={player.id}
                  player={player}
                  onUpdateFinalAmount={onUpdateFinalAmount}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </section>
        )}

        <div className="surface-card">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-secondary">Total in:</span>
              <span className="text-fg">{formatCurrency(totals.totalBuyIns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-secondary">Total out:</span>
              <span className="text-fg">{formatCurrency(totals.totalFinal)}</span>
            </div>
            <div className={`flex justify-between border-t border-border pt-2 font-medium ${isBalanced ? 'text-success' : 'text-danger'}`}>
              <span>Diff:</span>
              <span>{formatCurrency(totals.difference)}</span>
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
