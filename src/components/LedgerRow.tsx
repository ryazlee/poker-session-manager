import React from 'react'
import type { Player } from '../types'
import { handleCurrencyInput, formatCurrencyInput } from '../utils/currency'
import { getPlayerTotalBuyIn, isPlayerOut } from '../utils/buyIns'

interface LedgerRowProps {
  player: Player
  onUpdateFinalAmount: (playerId: string, amount: string) => void
  formatCurrency: (amount: number) => string
}

export default function LedgerRow({ player, onUpdateFinalAmount, formatCurrency }: LedgerRowProps) {
  const handleFinalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyInput(e.target.value, (value) => onUpdateFinalAmount(player.id, value))
  }

  const displayValue = formatCurrencyInput(player.finalAmount || '')
  const out = isPlayerOut(player)

  return (
    <div className="surface-card flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-fg">{player.name}</div>
        <div className="text-xs text-fg-secondary">
          {formatCurrency(getPlayerTotalBuyIn(player))} in
          {out ? ' · cashed out early' : ''}
        </div>
      </div>
      {out ? (
        <span className="text-sm font-medium text-fg">{displayValue || '$0.00'}</span>
      ) : (
        <input
          type="text"
          value={displayValue}
          onChange={handleFinalAmountChange}
          placeholder="$0.00"
          className="field w-24 px-2 py-1 text-right text-sm"
        />
      )}
    </div>
  )
}
