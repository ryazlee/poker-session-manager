import { useState } from 'react'
import type { AuditEntry } from '../types'

interface AuditTrailProps {
  auditTrail: AuditEntry[]
  formatCurrency: (amount: number) => string
  defaultCollapsed?: boolean
}

export default function AuditTrail({ auditTrail, formatCurrency, defaultCollapsed = true }: AuditTrailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  if (auditTrail.length === 0) return null

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getTimeDiff = (current: Date, previous?: Date) => {
    if (!previous) return ''
    const diff = Math.floor((new Date(current).getTime() - new Date(previous).getTime()) / 60000)
    return diff > 0 ? `+${diff}m` : ''
  }

  return (
    <div className="bg-gray-800 rounded p-3">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left text-sm text-gray-400 hover:text-white"
      >
        <span>🕒 Audit Trail ({auditTrail.length})</span>
        <span>{isCollapsed ? '▼' : '▲'}</span>
      </button>

      {!isCollapsed && (
        <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
          {auditTrail.map((entry, index) => {
            const prevEntry = auditTrail[index - 1]
            const timeDiff = getTimeDiff(entry.timestamp, prevEntry?.timestamp)

            return (
              <div key={entry.id} className="text-xs text-gray-300 bg-gray-700 rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {entry.action === 'rebuy' && entry.previousBuyIns !== undefined && entry.newBuyIns !== undefined && (
                      entry.newBuyIns > entry.previousBuyIns ? `${entry.playerName} rebuy` :
                        entry.newBuyIns < entry.previousBuyIns ? `${entry.playerName} cashout` :
                          `${entry.playerName} buy-in adjusted`
                    )}
                    {entry.action === 'add_player' && `${entry.playerName} joined`}
                    {entry.action === 'remove_player' && `${entry.playerName} left`}
                  </span>
                  <span className="text-gray-500">
                    {formatTime(entry.timestamp)} {timeDiff}
                  </span>
                </div>
                {entry.action === 'rebuy' && (
                  <div className="text-gray-400">
                    {entry.previousBuyIns} → {entry.newBuyIns} buy-ins • Pot: {formatCurrency(entry.totalPot)}
                  </div>
                )}
                {entry.action === 'add_player' && (
                  <div className="text-gray-400">
                    Started with {entry.newBuyIns} buy-in • Pot: {formatCurrency(entry.totalPot)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}