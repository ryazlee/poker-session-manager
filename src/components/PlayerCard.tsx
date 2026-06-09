import { useState } from 'react'
import type { Player } from "../types"
import { getPlayerTotalBuyIn } from '../utils/buyIns'
import { handleCurrencyInput } from '../utils/currency'

interface PlayerCardProps {
  player: Player
  buyInAmount: number
  onUpdateBuyIns: (playerId: string, change: number) => void
  onAddCustomBuyIn: (playerId: string, amount: number) => void
  onRemove: (playerId: string) => void
  formatCurrency: (amount: number) => string
}

export default function PlayerCard({
  player,
  buyInAmount,
  onUpdateBuyIns,
  onAddCustomBuyIn,
  onRemove,
  formatCurrency
}: PlayerCardProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [customAmount, setCustomAmount] = useState('')

  const total = getPlayerTotalBuyIn(player)
  const count = player.buyInAmounts.length

  const handleAddCustom = () => {
    const amount = parseFloat(customAmount)
    if (amount > 0) {
      onAddCustomBuyIn(player.id, amount)
      setCustomAmount('')
      setShowCustom(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-medium">{player.name}</div>
          <div className="text-gray-400 text-sm">
            {formatCurrency(total)}
            {count > 0 && <span className="text-gray-500"> · {count}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateBuyIns(player.id, -1)}
            disabled={count === 0}
            className="w-7 h-7 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded text-sm font-bold"
          >
            −
          </button>
          <span className="w-6 text-center text-white text-sm">{count}</span>
          <button
            onClick={() => onUpdateBuyIns(player.id, 1)}
            className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-bold"
            title={`Add ${formatCurrency(buyInAmount)}`}
          >
            +
          </button>
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`w-7 h-7 rounded text-sm font-bold ${showCustom ? 'bg-white text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            title="Custom buy-in"
          >
            $
          </button>
          <button
            onClick={() => onRemove(player.id)}
            className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm ml-1"
          >
            ×
          </button>
        </div>
      </div>
      {showCustom && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customAmount ? `$${customAmount}` : ''}
            onChange={(e) => handleCurrencyInput(e.target.value, setCustomAmount)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="Amount"
            autoFocus
            className="flex-1 px-2 py-1 bg-gray-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleAddCustom}
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="px-3 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-700 text-black disabled:text-gray-500 rounded text-sm font-medium"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
