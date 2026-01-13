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
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h3 className="font-medium text-white">{player.name}</h3>
        <p className="text-sm text-slate-400">{formatCurrency(player.buyIns * buyInAmount)}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateBuyIns(player.id, -1)}
          disabled={player.buyIns <= 0}
          className="w-8 h-8 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors touch-manipulation"
        >
          −
        </button>
        <span className="w-6 text-center text-white font-medium">{player.buyIns}</span>
        <button
          onClick={() => onUpdateBuyIns(player.id, 1)}
          className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors touch-manipulation"
        >
          +
        </button>
        <button
          onClick={() => onRemove(player.id)}
          className="w-8 h-8 bg-slate-600 hover:bg-slate-700 text-white rounded-full flex items-center justify-center text-lg transition-colors touch-manipulation ml-2"
        >
          ×
        </button>
      </div>
    </div>
  )
}