import { useState } from 'react'
import type { Player } from '../types'
import { getPlayerTotalBuyIn } from '../utils/buyIns'
import { handleCurrencyInput } from '../utils/currency'

interface PlayerCardProps {
  player: Player
  buyInAmount: number
  onUpdateBuyIns: (playerId: string, change: number) => void
  onAddCustomBuyIn: (playerId: string, amount: number) => void
  onCashOutPlayer: (playerId: string, amount: number) => void
  onRemove: (playerId: string) => void
  formatCurrency: (amount: number) => string
}

export default function PlayerCard({
  player,
  buyInAmount,
  onUpdateBuyIns,
  onAddCustomBuyIn,
  onCashOutPlayer,
  onRemove,
  formatCurrency
}: PlayerCardProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [showCashOut, setShowCashOut] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [cashOutAmount, setCashOutAmount] = useState('')

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

  const handleCashOut = () => {
    const amount = parseFloat(cashOutAmount)
    if (!isNaN(amount) && amount >= 0) {
      onCashOutPlayer(player.id, amount)
      setCashOutAmount('')
      setShowCashOut(false)
      setShowCustom(false)
    }
  }

  return (
    <div className="surface-card">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-fg">{player.name}</div>
          <div className="text-sm text-fg-secondary">
            {formatCurrency(total)} in
            {count > 0 ? <span> · {count} buy-in{count === 1 ? '' : 's'}</span> : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateBuyIns(player.id, -1)}
            disabled={count === 0}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-border bg-inset text-sm font-bold text-fg disabled:opacity-50"
            title="Undo last buy-in"
          >
            −
          </button>
          <span className="w-5 text-center text-sm text-fg">{count}</span>
          <button
            type="button"
            onClick={() => onUpdateBuyIns(player.id, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-border bg-inset text-sm font-bold text-fg"
            title={`Add ${formatCurrency(buyInAmount)}`}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustom(!showCustom)
              setShowCashOut(false)
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-[10px] text-sm font-bold ${
              showCustom ? 'bg-accent text-accent-contrast' : 'border border-border bg-inset text-fg'
            }`}
            title="Custom buy-in"
          >
            $
          </button>
          <button
            type="button"
            onClick={() => onRemove(player.id)}
            className="text-btn ml-1"
            title="Remove player"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setShowCashOut(!showCashOut)
            setShowCustom(false)
          }}
          className="text-btn"
        >
          {showCashOut ? 'Cancel cash out' : 'Cash out & leave'}
        </button>
      </div>

      {showCustom && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customAmount ? `$${customAmount}` : ''}
            onChange={(e) => handleCurrencyInput(e.target.value, setCustomAmount)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="Custom amount"
            autoFocus
            className="field flex-1 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="btn btn-primary px-3 py-2 text-sm"
          >
            Add
          </button>
        </div>
      )}

      {showCashOut && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={cashOutAmount ? `$${cashOutAmount}` : ''}
            onChange={(e) => handleCurrencyInput(e.target.value, setCashOutAmount)}
            onKeyDown={(e) => e.key === 'Enter' && handleCashOut()}
            placeholder="Left with"
            autoFocus
            className="field flex-1 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleCashOut}
            disabled={cashOutAmount === '' || isNaN(parseFloat(cashOutAmount))}
            className="btn btn-primary px-3 py-2 text-sm"
          >
            Out
          </button>
        </div>
      )}
    </div>
  )
}
