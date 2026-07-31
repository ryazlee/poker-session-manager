import React from 'react'
import type { Player } from "../types"
import { handleCurrencyInput, formatCurrencyInput } from '../utils/currency'
import { getPlayerTotalBuyIn } from '../utils/buyIns'

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

  return (
    <div className="bg-surface rounded-app border border-border p-3 flex items-center justify-between">
      <div>
        <div className="text-fg font-medium text-sm">{player.name}</div>
        <div className="text-fg-muted text-xs">{formatCurrency(getPlayerTotalBuyIn(player))} in</div>
      </div>
      <input
        type="text"
        value={displayValue}
        onChange={handleFinalAmountChange}
        placeholder="$0.00"
        className="w-20 px-2 py-1 bg-inset text-fg rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent text-right"
      />
    </div>
  )
}