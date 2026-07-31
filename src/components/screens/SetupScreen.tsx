import React from 'react'
import { handleCurrencyInput, formatCurrencyInput } from '../../utils/currency'
import AppIcon from '../AppIcon'
import ThemeToggle from '../ThemeToggle'

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
    <div className="flex min-h-screen flex-col bg-app p-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <AppIcon size="lg" className="mb-4" />
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-fg">
          Poker Session Manager
        </h1>
        <p className="mb-8 text-sm text-fg-secondary">
          Track buy-ins, cashouts, and the pot.
        </p>

        <div className="w-full max-w-xs space-y-4">
          <input
            type="text"
            value={displayValue}
            onChange={handleBuyInChange}
            onKeyDown={(e) => e.key === 'Enter' && onStartGame()}
            className="w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Buy-in Amount (e.g., $20)"
          />

          <button
            type="button"
            onClick={onStartGame}
            className="w-full rounded-[10px] bg-accent py-3 font-semibold text-accent-contrast transition-opacity hover:opacity-90"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}
