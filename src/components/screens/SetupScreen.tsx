import React from 'react'
import { handleCurrencyInput, formatCurrencyInput } from '../../utils/currency'
import AppIcon from '../AppIcon'

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
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <AppIcon size="lg" className="mb-4" />
      <h1 className="text-2xl text-white mb-8">Poker Session Manager</h1>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={displayValue}
          onChange={handleBuyInChange}
          onKeyDown={(e) => e.key === 'Enter' && onStartGame()}
          className="w-full px-4 py-3 bg-gray-800 text-white rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Buy-in Amount (e.g., $20)"
        />

        <button
          onClick={onStartGame}
          className="w-full py-3 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  )
}