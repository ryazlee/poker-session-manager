import type { Player, GameSession } from '../types'

export function isPlayerOut(player: Player): boolean {
  return player.status === 'out'
}

export function getPlayerTotalBuyIn(player: Player): number {
  return player.buyInAmounts.reduce((sum, amount) => sum + amount, 0)
}

export function getSessionTotalPot(session: GameSession): number {
  return session.players.reduce((sum, player) => sum + getPlayerTotalBuyIn(player), 0)
}

export function getActivePlayers(session: GameSession): Player[] {
  return session.players.filter(player => !isPlayerOut(player))
}

export function getOutPlayers(session: GameSession): Player[] {
  return session.players.filter(player => isPlayerOut(player))
}

export function getTotalCashedOut(session: GameSession): number {
  return getOutPlayers(session).reduce(
    (sum, player) => sum + (parseFloat(player.finalAmount || '0') || 0),
    0
  )
}

export function getMoneyInPlay(session: GameSession): number {
  return getSessionTotalPot(session) - getTotalCashedOut(session)
}

export function encodeBuyInAmounts(amounts: number[]): string {
  if (amounts.length === 0) return '0'
  return amounts.join('+')
}

export function decodeBuyInAmounts(encoded: string, tableBuyIn: number): number[] {
  if (encoded.includes('+')) {
    return encoded
      .split('+')
      .map(amount => parseFloat(amount))
      .filter(amount => !isNaN(amount) && amount > 0)
  }

  const asFloat = parseFloat(encoded)
  if (isNaN(asFloat) || asFloat <= 0) return [tableBuyIn]

  const asInt = parseInt(encoded, 10)
  const isLegacyCount =
    Number.isInteger(asFloat) &&
    encoded === String(asInt) &&
    asInt >= 1 &&
    asInt <= 9

  // Legacy shared links used a bare integer as a rebuy count (e.g. "2" = two table buy-ins).
  // Dollar amounts like "20" must decode as a single buy-in, not twenty rebuys.
  if (isLegacyCount) {
    return Array(asInt).fill(tableBuyIn)
  }

  return [asFloat]
}

export function normalizePlayer(player: Record<string, unknown>, tableBuyIn: number): Player {
  if (Array.isArray(player.buyInAmounts)) {
    return {
      ...(player as unknown as Player),
      status: player.status === 'out' ? 'out' : 'active',
    }
  }
  const legacyCount = typeof player.buyIns === 'number' ? player.buyIns : 1
  return {
    id: player.id as string,
    name: player.name as string,
    buyInAmounts: Array(Math.max(legacyCount, 0)).fill(tableBuyIn),
    finalAmount: player.finalAmount as string | undefined,
    status: player.status === 'out' ? 'out' : 'active',
  }
}

export function normalizeSession(session: Record<string, unknown>): GameSession {
  const buyInAmount = typeof session.buyInAmount === 'number' ? session.buyInAmount : 20
  const players = Array.isArray(session.players)
    ? session.players.map((p: Record<string, unknown>) => normalizePlayer(p, buyInAmount))
    : []
  return { ...session, players } as GameSession
}
