import type { GameSession } from '../../types'
import PlayerCard from '../PlayerCard'
import OutPlayerCard from '../OutPlayerCard'
import AuditTrail from '../AuditTrail'
import ScreenHeader from '../ScreenHeader'
import AppShell from '../AppShell'
import {
  getActivePlayers,
  getOutPlayers,
  getMoneyInPlay,
  getSessionTotalPot,
} from '../../utils/buyIns'

interface ActiveGameScreenProps {
  session: GameSession
  newPlayerName: string
  setNewPlayerName: (name: string) => void
  onAddPlayer: () => void
  onUpdateBuyIns: (playerId: string, change: number) => void
  onAddCustomBuyIn: (playerId: string, amount: number) => void
  onCashOutPlayer: (playerId: string, amount: number) => void
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
  onCashOutPlayer,
  onRemovePlayer,
  onGoToLedger,
  onReset,
  formatCurrency
}: ActiveGameScreenProps) {
  const activePlayers = getActivePlayers(session)
  const outPlayers = getOutPlayers(session)
  const totalPot = getSessionTotalPot(session)
  const inPlay = getMoneyInPlay(session)

  return (
    <AppShell
      header={(
        <ScreenHeader
          title="Game"
          subtitle={`${formatCurrency(session.buyInAmount)} buy-in`}
        />
      )}
      footer={(
        <>
          <p className="status">
            Pot {formatCurrency(totalPot)}
            {outPlayers.length > 0 ? ` · ${formatCurrency(inPlay)} in play` : ''}
          </p>
          <div className="actions">
            <button
              type="button"
              onClick={onGoToLedger}
              disabled={session.players.length === 0}
              className="btn btn-primary"
            >
              Count chips
            </button>
            <button
              type="button"
              onClick={onReset}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </>
      )}
    >
      <div className="stage-scroll">
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            onKeyDown={(e) => e.key === 'Enter' && onAddPlayer()}
            className="field flex-1 py-2 text-sm"
          />
          <button
            type="button"
            onClick={onAddPlayer}
            disabled={!newPlayerName.trim()}
            className="btn btn-primary px-4 py-2 text-sm"
          >
            Add
          </button>
        </div>

        {activePlayers.length > 0 && (
          <section>
            <p className="section-label mb-2">At the table</p>
            <div className="flex flex-col gap-2">
              {activePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  buyInAmount={session.buyInAmount}
                  onUpdateBuyIns={onUpdateBuyIns}
                  onAddCustomBuyIn={onAddCustomBuyIn}
                  onCashOutPlayer={onCashOutPlayer}
                  onRemove={onRemovePlayer}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </section>
        )}

        {outPlayers.length > 0 && (
          <section>
            <p className="section-label mb-2">Cashed out</p>
            <div className="flex flex-col gap-2">
              {outPlayers.map((player) => (
                <OutPlayerCard
                  key={player.id}
                  player={player}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </section>
        )}

        <AuditTrail
          auditTrail={session.auditTrail}
          formatCurrency={formatCurrency}
          defaultCollapsed={true}
        />
      </div>
    </AppShell>
  )
}
