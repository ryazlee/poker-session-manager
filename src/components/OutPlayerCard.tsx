import type { Player } from '../types'
import { getPlayerTotalBuyIn } from '../utils/buyIns'

interface OutPlayerCardProps {
  player: Player
  formatCurrency: (amount: number) => string
}

export default function OutPlayerCard({ player, formatCurrency }: OutPlayerCardProps) {
  const leftWith = parseFloat(player.finalAmount || '0') || 0
  const boughtIn = getPlayerTotalBuyIn(player)
  const profit = leftWith - boughtIn

  return (
    <div className="surface-card surface-card-muted">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-fg">{player.name}</div>
          <div className="text-sm text-fg-secondary">
            {formatCurrency(boughtIn)} in · left with {formatCurrency(leftWith)}
          </div>
        </div>
        <span className="section-label">Out</span>
      </div>
      {profit !== 0 && (
        <div className={`mt-1 text-xs ${profit > 0 ? 'text-success' : 'text-danger'}`}>
          {profit > 0 ? '+' : ''}{formatCurrency(profit)} session
        </div>
      )}
    </div>
  )
}
