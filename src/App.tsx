import { useState, useEffect } from 'react'
import type { GameSession, Player, GameState, AuditEntry } from './types'
import SetupScreen from './components/screens/SetupScreen'
import ActiveGameScreen from './components/screens/ActiveGameScreen'
import LedgerScreen from './components/screens/LedgerScreen'
import SummaryScreen from './components/screens/SummaryScreen'
import { ThemeProvider } from './theme'
import { trackPageview } from './utils/analytics'
import {
  getPlayerTotalBuyIn,
  getSessionTotalPot,
  encodeBuyInAmounts,
  decodeBuyInAmounts,
  normalizeSession,
  isPlayerOut,
} from './utils/buyIns'

// URL state encoding/decoding utilities
// Format: #buyIn=20&state=active&players=Alice:20+20:40,Bob:20:15
// Each player is name:buyInAmounts:finalAmount (amounts joined with +, finalAmount optional)
function encodeSessionToURL(session: GameSession, gameState: GameState): string {
  const params = new URLSearchParams()
  params.set('buyIn', session.buyInAmount.toString())
  params.set('state', gameState)

  const playerStrings = session.players.map(p => {
    const parts = [encodeURIComponent(p.name), encodeBuyInAmounts(p.buyInAmounts)]
    if (p.finalAmount !== undefined) {
      parts.push(p.finalAmount)
    }
    if (p.status === 'out') {
      parts.push('out')
    }
    return parts.join(':')
  })

  if (playerStrings.length > 0) {
    params.set('players', playerStrings.join(','))
  }

  return params.toString()
}

function decodeSessionFromURL(hash: string): { session: GameSession; gameState: GameState } | null {
  try {
    const params = new URLSearchParams(hash)
    const buyIn = parseFloat(params.get('buyIn') || '')
    const state = params.get('state') as GameState
    const playersStr = params.get('players') || ''

    if (isNaN(buyIn) || !state) return null

    const players: Player[] = playersStr ? playersStr.split(',').map((p, i) => {
      const [name, buyInsEncoded, ...rest] = p.split(':')
      let finalAmount: string | undefined
      let status: Player['status'] = 'active'

      if (rest.length === 1) {
        if (rest[0] === 'out') {
          status = 'out'
        } else {
          finalAmount = rest[0]
        }
      } else if (rest.length >= 2) {
        finalAmount = rest[0]
        status = rest[1] === 'out' ? 'out' : 'active'
      }

      return {
        id: Date.now().toString() + i,
        name: decodeURIComponent(name),
        buyInAmounts: decodeBuyInAmounts(buyInsEncoded, buyIn),
        finalAmount,
        status,
      }
    }) : []

    const session: GameSession = {
      id: Date.now().toString(),
      buyInAmount: buyIn,
      players,
      auditTrail: [],
      isActive: state === 'active',
      createdAt: new Date()
    }

    return { session, gameState: state }
  } catch {
    return null
  }
}

function App() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [session, setSession] = useState<GameSession | null>(null)
  const [buyInAmount, setBuyInAmount] = useState<string>('')
  const [newPlayerName, setNewPlayerName] = useState('')

  // Load session from URL hash first, then localStorage
  useEffect(() => {
    trackPageview()
    const hash = window.location.hash.slice(1)
    if (hash) {
      const decoded = decodeSessionFromURL(hash)
      if (decoded) {
        setSession(decoded.session)
        setGameState(decoded.gameState)
        return
      }
    }

    const savedSession = localStorage.getItem('pokerSession')
    if (savedSession) {
      const parsed = JSON.parse(savedSession)
      if (!parsed.auditTrail) {
        parsed.auditTrail = []
      }
      setSession(normalizeSession(parsed))
      if (parsed.isActive) {
        setGameState('active')
      }
    }
  }, [])

  // Keep URL hash in sync with session state so users can copy URL directly
  useEffect(() => {
    if (session && gameState !== 'setup') {
      const encoded = encodeSessionToURL(session, gameState)
      window.history.replaceState(null, '', `#${encoded}`)
    } else {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [session, gameState])

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem('pokerSession', JSON.stringify(session))
    }
  }, [session])

  const addAuditEntry = (
    sessionSnapshot: GameSession,
    entry: Omit<AuditEntry, 'id' | 'timestamp' | 'totalPot'>
  ) => {
    const totalPot = getSessionTotalPot(sessionSnapshot)
    const auditEntry: AuditEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
      totalPot
    }

    return {
      ...sessionSnapshot,
      auditTrail: [...sessionSnapshot.auditTrail, auditEntry]
    }
  }

  const startNewGame = () => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      buyInAmount: parseFloat(buyInAmount) || 20,
      players: [],
      auditTrail: [],
      isActive: true,
      createdAt: new Date()
    }
    setSession(newSession)
    setGameState('active')
  }

  const addPlayer = () => {
    if (!newPlayerName.trim() || !session) return

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      buyInAmounts: [session.buyInAmount],
      status: 'active',
    }

    const updatedSession = addAuditEntry({
      ...session,
      players: [...session.players, newPlayer]
    }, {
      playerId: newPlayer.id,
      playerName: newPlayer.name,
      action: 'add_player',
      amount: session.buyInAmount,
      newTotal: session.buyInAmount,
    })

    setSession(updatedSession)
    setNewPlayerName('')
  }

  const updateBuyIns = (playerId: string, change: number) => {
    if (!session || change === 0) return

    const player = session.players.find(p => p.id === playerId)
    if (!player || isPlayerOut(player)) return

    const previousTotal = getPlayerTotalBuyIn(player)
    let newAmounts: number[]

    if (change > 0) {
      newAmounts = [...player.buyInAmounts, session.buyInAmount]
    } else {
      if (player.buyInAmounts.length === 0) return
      newAmounts = player.buyInAmounts.slice(0, -1)
    }

    const newTotal = newAmounts.reduce((sum, a) => sum + a, 0)
    const amount = Math.abs(newTotal - previousTotal)

    setSession(addAuditEntry({
      ...session,
      players: session.players.map(p =>
        p.id === playerId ? { ...p, buyInAmounts: newAmounts } : p
      )
    }, {
      playerId: player.id,
      playerName: player.name,
      action: change > 0 ? 'rebuy' : 'undo_buyin',
      amount,
      previousTotal,
      newTotal,
    }))
  }

  const addCustomBuyIn = (playerId: string, amount: number) => {
    if (!session || amount <= 0) return

    const player = session.players.find(p => p.id === playerId)
    if (!player || isPlayerOut(player)) return

    const previousTotal = getPlayerTotalBuyIn(player)
    const newAmounts = [...player.buyInAmounts, amount]
    const newTotal = previousTotal + amount

    setSession(addAuditEntry({
      ...session,
      players: session.players.map(p =>
        p.id === playerId ? { ...p, buyInAmounts: newAmounts } : p
      )
    }, {
      playerId: player.id,
      playerName: player.name,
      action: 'custom_buyin',
      amount,
      previousTotal,
      newTotal,
    }))
  }

  const cashOutPlayer = (playerId: string, amount: number) => {
    if (!session || amount < 0) return

    const player = session.players.find(p => p.id === playerId)
    if (!player || isPlayerOut(player)) return

    setSession(addAuditEntry({
      ...session,
      players: session.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              status: 'out' as const,
              finalAmount: amount.toString(),
            }
          : p
      )
    }, {
      playerId: player.id,
      playerName: player.name,
      action: 'player_out',
      amount,
      previousTotal: getPlayerTotalBuyIn(player),
      newTotal: amount,
    }))
  }

  const removePlayer = (playerId: string) => {
    if (!session) return

    const player = session.players.find(p => p.id === playerId)
    if (!player || isPlayerOut(player)) return

    setSession(addAuditEntry({
      ...session,
      players: session.players.filter(p => p.id !== playerId)
    }, {
      playerId: player.id,
      playerName: player.name,
      action: 'remove_player',
    }))
  }

  const updateFinalAmount = (playerId: string, amount: string) => {
    if (!session) return

    setSession({
      ...session,
      players: session.players.map(player =>
        player.id === playerId
          ? { ...player, finalAmount: amount }
          : player
      )
    })
  }

  const resetGame = () => {
    localStorage.removeItem('pokerSession')
    setSession(null)
    setGameState('setup')
    setBuyInAmount('')
  }

  const calculateTotals = () => {
    if (!session) return { totalBuyIns: 0, totalFinal: 0, difference: 0 }

    const totalBuyIns = getSessionTotalPot(session)
    const totalFinal = session.players.reduce((sum, player) => sum + (parseFloat(player.finalAmount || '0') || 0), 0)

    return {
      totalBuyIns,
      totalFinal,
      difference: Math.abs(totalBuyIns - totalFinal)
    }
  }

  const formatCurrency = (amount: number) => amount > 0 ? `$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`

  let screen = null

  if (gameState === 'setup') {
    screen = (
      <SetupScreen
        buyInAmount={buyInAmount}
        setBuyInAmount={setBuyInAmount}
        onStartGame={startNewGame}
      />
    )
  } else if (gameState === 'active' && session) {
    screen = (
      <ActiveGameScreen
        session={session}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        onAddPlayer={addPlayer}
        onUpdateBuyIns={updateBuyIns}
        onAddCustomBuyIn={addCustomBuyIn}
        onCashOutPlayer={cashOutPlayer}
        onRemovePlayer={removePlayer}
        onGoToLedger={() => setGameState('ledger')}
        onReset={resetGame}
        formatCurrency={formatCurrency}
      />
    )
  } else if (gameState === 'ledger' && session) {
    screen = (
      <LedgerScreen
        session={session}
        onUpdateFinalAmount={updateFinalAmount}
        onGoBack={() => setGameState('active')}
        onGoToSummary={() => setGameState('summary')}
        formatCurrency={formatCurrency}
        calculateTotals={calculateTotals}
      />
    )
  } else if (gameState === 'summary' && session) {
    screen = (
      <SummaryScreen
        session={session}
        onGoBack={() => setGameState('ledger')}
        onNewGame={() => {
          setSession(null)
          localStorage.removeItem('pokerSession')
          setGameState('setup')
          setBuyInAmount('')
        }}
        formatCurrency={formatCurrency}
        calculateTotals={calculateTotals}
      />
    )
  }

  return <ThemeProvider>{screen}</ThemeProvider>
}

export default App
