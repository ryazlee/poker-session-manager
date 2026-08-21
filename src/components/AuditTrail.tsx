import { useState } from 'react'
import type { AuditEntry } from '../types'

interface AuditTrailProps {
  auditTrail: AuditEntry[]
  formatCurrency: (amount: number) => string
  defaultCollapsed?: boolean
}

function getVerb(action: AuditEntry['action']): string {
  switch (action) {
    case 'rebuy':
      return 'rebuy'
    case 'custom_buyin':
      return 'custom'
    case 'undo_buyin':
    case 'cashout':
      return 'undo'
    case 'player_out':
      return 'out'
    case 'add_player':
      return 'in'
    case 'remove_player':
      return 'removed'
    default:
      return ''
  }
}

function getAmountDisplay(
  entry: AuditEntry,
  formatCurrency: (amount: number) => string
): { text: string; tone: 'plus' | 'minus' | 'neutral' } | null {
  switch (entry.action) {
    case 'rebuy':
    case 'custom_buyin':
    case 'add_player':
      return entry.amount !== undefined
        ? { text: `+${formatCurrency(entry.amount)}`, tone: 'plus' }
        : null
    case 'undo_buyin':
    case 'cashout':
      return entry.amount !== undefined
        ? { text: `−${formatCurrency(entry.amount)}`, tone: 'minus' }
        : null
    case 'player_out':
      return entry.newTotal !== undefined
        ? { text: formatCurrency(entry.newTotal), tone: 'neutral' }
        : null
    default:
      return null
  }
}

export default function AuditTrail({ auditTrail, formatCurrency, defaultCollapsed = true }: AuditTrailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  if (auditTrail.length === 0) return null

  const entries = [...auditTrail].reverse()

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <section className="log">
      <div className="log-header">
        <p className="section-label">Buy-in log · {auditTrail.length}</p>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-btn"
        >
          {isCollapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!isCollapsed && (
        <ul className="log-list">
          {entries.map((entry) => {
            const amount = getAmountDisplay(entry, formatCurrency)
            const verb = getVerb(entry.action)

            return (
              <li key={entry.id} className="log-item">
                <span className="log-main">
                  <span className="log-name">{entry.playerName}</span>
                  <span className="log-verb">{verb}</span>
                </span>
                {amount ? (
                  <span className={`log-amount log-amount--${amount.tone}`}>
                    {amount.text}
                  </span>
                ) : (
                  <span className="log-amount log-amount--empty" aria-hidden="true" />
                )}
                <span className="log-time">{formatTime(entry.timestamp)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
