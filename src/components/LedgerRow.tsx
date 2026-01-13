import type { Player } from '../types'

interface LedgerRowProps {
  player: Player
  buyInAmount: number
  onUpdateFinalAmount: (playerId: string, amount: string) => void
  formatCurrency: (amount: number) => string
}

export default function LedgerRow({ player, buyInAmount, onUpdateFinalAmount, formatCurrency }: LedgerRowProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h3 className="font-medium text-white text-sm">{player.name}</h3>
        <p className="text-xs text-slate-400">{formatCurrency(player.buyIns * buyInAmount)} in</p>
      </div>
      <div className="relative">
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">$</span>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={player.finalAmount || ''}
          onChange={(e) => onUpdateFinalAmount(player.id, e.target.value)}
          className="w-20 pl-6 pr-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  )
}