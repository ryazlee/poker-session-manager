import type { Player } from "../types"

interface PlayerCardProps {
  player: Player
  buyInAmount: number
  onUpdateBuyIns: (playerId: string, change: number) => void
  onRemove: (playerId: string) => void
  formatCurrency: (amount: number) => string
}

export default function PlayerCard({ player, buyInAmount, onUpdateBuyIns, onRemove, formatCurrency }: PlayerCardProps) {
  return (
    <div className="bg-gray-800 rounded p-3 flex items-center justify-between">
      <div>
        <div className="text-white font-medium">{player.name}</div>
        <div className="text-gray-400 text-sm">{formatCurrency(player.buyIns * buyInAmount)}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateBuyIns(player.id, -1)}
          disabled={player.buyIns <= 0}
          className="w-7 h-7 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded text-sm font-bold"
        >
          −
        </button>
        <span className="w-6 text-center text-white text-sm">{player.buyIns}</span>
        <button
          onClick={() => onUpdateBuyIns(player.id, 1)}
          className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-bold"
        >
          +
        </button>
        <button
          onClick={() => onRemove(player.id)}
          className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm ml-1"
        >
          ×
        </button>
      </div>
    </div>
  )
}