import type { Player, GameSession } from '../types'

export function getPlayerTotalBuyIn(player: Player): number {
  return player.buyInAmounts.reduce((sum, amount) => sum + amount, 0)
}

export function getSessionTotalPot(session: GameSession): number {
  return session.players.reduce((sum, player) => sum + getPlayerTotalBuyIn(player), 0)
}

export function encodeBuyInAmounts(amounts: number[]): string {
  return amounts.join('+')
}

export function decodeBuyInAmounts(encoded: string, tableBuyIn: number): number[] {
  if (encoded.includes('+')) {
    return encoded.split('+').map(a => parseFloat(a)).filter(a => !isNaN(a) && a > 0)
  }
  const count = parseInt(encoded, 10)
  if (!isNaN(count) && count > 0) {
    return Array(count).fill(tableBuyIn)
  }
  return [tableBuyIn]
}

export function normalizePlayer(player: Record<string, unknown>, tableBuyIn: number): Player {
  if (Array.isArray(player.buyInAmounts)) {
    return player as unknown as Player
  }
  const legacyCount = typeof player.buyIns === 'number' ? player.buyIns : 1
  return {
    id: player.id as string,
    name: player.name as string,
    buyInAmounts: Array(Math.max(legacyCount, 0)).fill(tableBuyIn),
    finalAmount: player.finalAmount as string | undefined,
  }
}

export function normalizeSession(session: Record<string, unknown>): GameSession {
  const buyInAmount = typeof session.buyInAmount === 'number' ? session.buyInAmount : 20
  const players = Array.isArray(session.players)
    ? session.players.map((p: Record<string, unknown>) => normalizePlayer(p, buyInAmount))
    : []
  return { ...session, players } as GameSession
}
