import React from 'react'
import type { Player } from "../types"
import { handleCurrencyInput, formatCurrencyInput } from '../utils/currency'

interface LedgerRowProps {
  player: Player
  buyInAmount: number
  onUpdateFinalAmount: (playerId: string, amount: string) => void
  formatCurrency: (amount: number) => string
}

export default function LedgerRow({ player, buyInAmount, onUpdateFinalAmount, formatCurrency }: LedgerRowProps) {
  const handleFinalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyInput(e.target.value, (value) => onUpdateFinalAmount(player.id, value))
  }

  const displayValue = formatCurrencyInput(player.finalAmount || '')

  return (
    <div className="bg-gray-800 rounded p-3 flex items-center justify-between">
      <div>
        <div className="text-white font-medium text-sm">{player.name}</div>
        <div className="text-gray-400 text-xs">{formatCurrency(player.buyIns * buyInAmount)} in</div>
      </div>
      <input
        type="text"
        value={displayValue}
        onChange={handleFinalAmountChange}
        placeholder="$0.00"
        className="w-20 px-2 py-1 bg-gray-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-white text-right"
      />
    </div>
  )
}