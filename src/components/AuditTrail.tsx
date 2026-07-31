import { useState } from 'react'
import type { AuditEntry } from '../types'

interface AuditTrailProps {
  auditTrail: AuditEntry[]
  formatCurrency: (amount: number) => string
  defaultCollapsed?: boolean
}

function getActionLabel(entry: AuditEntry): string {
  switch (entry.action) {
    case 'rebuy':
      return `${entry.playerName} rebuy`
    case 'custom_buyin':
      return `${entry.playerName} custom buy-in`
    case 'cashout':
      return `${entry.playerName} cashout`
    case 'add_player':
      return `${entry.playerName} joined`
    case 'remove_player':
      return `${entry.playerName} left`
    default:
      return entry.playerName
  }
}

export default function AuditTrail({ auditTrail, formatCurrency, defaultCollapsed = true }: AuditTrailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  if (auditTrail.length === 0) return null

  const entries = [...auditTrail].reverse()

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
    <div className="bg-surface rounded-app border border-border p-3">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left text-sm text-fg-muted hover:text-fg"
      >
        <span>🕒 Audit Trail ({auditTrail.length})</span>
        <span>{isCollapsed ? '▼' : '▲'}</span>
      </button>

      {!isCollapsed && (
        <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
          {entries.map((entry, index) => {
            const prevEntry = entries[index + 1]
            const timeDiff = getTimeDiff(entry.timestamp, prevEntry?.timestamp)

            return (
              <div key={entry.id} className="text-xs text-fg-secondary bg-inset rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{getActionLabel(entry)}</span>
                  <span className="text-fg-muted">
                    {formatTime(entry.timestamp)} {timeDiff}
                  </span>
                </div>
                {(entry.action === 'rebuy' || entry.action === 'custom_buyin' || entry.action === 'cashout' || entry.action === 'add_player') && (
                  <div className="text-fg-muted">
                    {entry.amount !== undefined && (
                      <span>{entry.action === 'cashout' ? '−' : '+'}{formatCurrency(entry.amount)}</span>
                    )}
                    {entry.newTotal !== undefined && (
                      <span> • Total: {formatCurrency(entry.newTotal)}</span>
                    )}
                    <span> • Pot: {formatCurrency(entry.totalPot)}</span>
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
