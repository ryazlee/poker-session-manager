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
    case 'undo_buyin':
    case 'cashout':
      return `${entry.playerName} undo buy-in`
    case 'player_out':
      return `${entry.playerName} cashed out`
    case 'add_player':
      return `${entry.playerName} joined`
    case 'remove_player':
      return `${entry.playerName} removed`
    default:
      return entry.playerName
  }
}

function getAmountPrefix(action: AuditEntry['action']): string {
  if (action === 'undo_buyin' || action === 'cashout') return '−'
  if (action === 'player_out') return ''
  return '+'
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
    <section className="history">
      <div className="history-header">
        <p className="section-label">Buy-in log</p>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-btn"
        >
          {isCollapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!isCollapsed && (
        <ul className="history-list">
          {entries.map((entry, index) => {
            const prevEntry = entries[index + 1]
            const timeDiff = getTimeDiff(entry.timestamp, prevEntry?.timestamp)
            const showDetails = entry.action !== 'remove_player'

            return (
              <li key={entry.id} className="history-item">
                <div className="min-w-0">
                  <div className="history-text">{getActionLabel(entry)}</div>
                  {showDetails && (
                    <div className="history-meta">
                      {entry.amount !== undefined && (
                        <span>{getAmountPrefix(entry.action)}{formatCurrency(entry.amount)}</span>
                      )}
                      {entry.newTotal !== undefined && entry.action !== 'player_out' && (
                        <span> · In: {formatCurrency(entry.newTotal)}</span>
                      )}
                      {entry.action === 'player_out' && entry.newTotal !== undefined && (
                        <span> · Left with {formatCurrency(entry.newTotal)}</span>
                      )}
                      <span> · Pot {formatCurrency(entry.totalPot)}</span>
                    </div>
                  )}
                </div>
                <span className="history-time">
                  {formatTime(entry.timestamp)} {timeDiff}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
