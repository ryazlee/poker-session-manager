import type { Player } from "../types"

interface LedgerRowProps {
  player: Player
  buyInAmount: number
  onUpdateFinalAmount: (playerId: string, amount: string) => void
  formatCurrency: (amount: number) => string
}

export default function LedgerRow({ player, buyInAmount, onUpdateFinalAmount, formatCurrency }: LedgerRowProps) {
  return (
    <div className="bg-gray-800 rounded p-3 flex items-center justify-between">
      <div>
        <div className="text-white font-medium text-sm">{player.name}</div>
        <div className="text-gray-400 text-xs">{formatCurrency(player.buyIns * buyInAmount)} in</div>
      </div>
      <input
        type="number"
        step="0.01"
        placeholder="0"
        value={player.finalAmount || ''}
        onChange={(e) => onUpdateFinalAmount(player.id, e.target.value)}
        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
      />
    </div>
  )
}