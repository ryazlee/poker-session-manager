export interface Player {
  id: string
  name: string
  buyInAmounts: number[]
  finalAmount?: string
}

export interface AuditEntry {
  id: string
  timestamp: Date
  playerId: string
  playerName: string
  action: 'rebuy' | 'custom_buyin' | 'cashout' | 'add_player' | 'remove_player'
  amount?: number
  previousTotal?: number
  newTotal?: number
  totalPot: number
}

export interface GameSession {
  id: string
  buyInAmount: number
  players: Player[]
  auditTrail: AuditEntry[]
  isActive: boolean
  createdAt: Date
}

export type GameState = 'setup' | 'active' | 'ledger' | 'summary'