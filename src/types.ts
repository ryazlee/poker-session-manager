export interface Player {
  id: string
  name: string
  buyIns: number
  finalAmount?: number
}

export interface GameSession {
  id: string
  buyInAmount: number
  players: Player[]
  isActive: boolean
  createdAt: Date
}

export type GameState = 'setup' | 'active' | 'ledger' | 'summary'