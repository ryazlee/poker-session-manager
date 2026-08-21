import React from 'react'
import { handleCurrencyInput, formatCurrencyInput } from '../../utils/currency'
import AppIcon from '../AppIcon'
import AppShell from '../AppShell'
import MakerCredit from '../MakerCredit'
import PageHeader from '../PageHeader'

interface SetupScreenProps {
  buyInAmount: string
  setBuyInAmount: (amount: string) => void
  onStartGame: () => void
}

export default function SetupScreen({ buyInAmount, setBuyInAmount, onStartGame }: SetupScreenProps) {
  const handleBuyInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyInput(e.target.value, setBuyInAmount)
  }

  const displayValue = formatCurrencyInput(buyInAmount)

  return (
    <AppShell
      centered
      header={<PageHeader />}
      footer={(
        <>
          <p className="status">Set the table buy-in to start tracking.</p>
          <button
            type="button"
            onClick={onStartGame}
            className="btn btn-primary w-full"
          >
            Start game
          </button>
        </>
      )}
    >
      <div className="flex flex-col items-center text-center">
        <AppIcon size="lg" className="mb-4" />
        <h1 className="m-0 text-2xl font-semibold tracking-tight text-fg">
          Poker Session Manager
        </h1>
        <p className="subtitle mt-2 max-w-xs text-balance">
          Track buy-ins, early cashouts, and the pot.
        </p>
        <MakerCredit />

        <div className="mt-8 w-full max-w-xs">
          <input
            type="text"
            value={displayValue}
            onChange={handleBuyInChange}
            onKeyDown={(e) => e.key === 'Enter' && onStartGame()}
            className="field"
            placeholder="Buy-in amount (e.g., $20)"
          />
        </div>
      </div>
    </AppShell>
  )
}
