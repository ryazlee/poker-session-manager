export interface Player {
  id: string
  name: string
  buyIns: number
  finalAmount?: number
}

export interface AuditEntry {
  id: string
  timestamp: Date
  playerId: string
  playerName: string
  action: 'rebuy' | 'add_player' | 'remove_player'
  previousBuyIns?: number
  newBuyIns?: number
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