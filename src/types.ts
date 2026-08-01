export type PlayerStatus = 'active' | 'out'

export interface Player {
  id: string
  name: string
  buyInAmounts: number[]
  finalAmount?: string
  status?: PlayerStatus
}

export interface AuditEntry {
  id: string
  timestamp: Date
  playerId: string
  playerName: string
  action: 'rebuy' | 'custom_buyin' | 'undo_buyin' | 'player_out' | 'add_player' | 'remove_player' | 'cashout'
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