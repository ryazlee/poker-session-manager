import { useState, useEffect } from 'react'
import type { GameSession, Player, GameState, AuditEntry } from './types'
import SetupScreen from './components/screens/SetupScreen'
import ActiveGameScreen from './components/screens/ActiveGameScreen'
import LedgerScreen from './components/screens/LedgerScreen'
import SummaryScreen from './components/screens/SummaryScreen'

function App() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [session, setSession] = useState<GameSession | null>(null)
  const [buyInAmount, setBuyInAmount] = useState<string>('')
  const [newPlayerName, setNewPlayerName] = useState('')

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('pokerSession')
    if (savedSession) {
      const parsed = JSON.parse(savedSession)
      // Ensure auditTrail exists for backward compatibility
      if (!parsed.auditTrail) {
        parsed.auditTrail = []
      }
      setSession(parsed)
      if (parsed.isActive) {
        setGameState('active')
      }
    }
  }, [])

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem('pokerSession', JSON.stringify(session))
    }
  }, [session])

  const addAuditEntry = (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'totalPot'>) => {
    if (!session) return

    const totalPot = session.players.reduce((sum, player) =>
      sum + (player.buyIns * session.buyInAmount), 0
    )

    const auditEntry: AuditEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
      totalPot
    }

    setSession(prev => prev ? {
      ...prev,
      auditTrail: [...prev.auditTrail, auditEntry]
    } : null)
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
      buyIns: 1
    }

    setSession({
      ...session,
      players: [...session.players, newPlayer]
    })

    // Add to audit trail
    addAuditEntry({
      playerId: newPlayer.id,
      playerName: newPlayer.name,
      action: 'add_player',
      newBuyIns: 1
    })

    setNewPlayerName('')
  }

  const updateBuyIns = (playerId: string, change: number) => {
    if (!session) return

    const player = session.players.find(p => p.id === playerId)
    if (!player) return

    const newBuyIns = Math.max(0, player.buyIns + change)

    // Update session first
    const updatedSession = {
      ...session,
      players: session.players.map(p =>
        p.id === playerId
          ? { ...p, buyIns: newBuyIns }
          : p
      )
    }

    setSession(updatedSession)

    // Track all buy-in changes (increases and decreases) with updated pot
    if (change !== 0 && newBuyIns !== player.buyIns) {
      const totalPot = updatedSession.players.reduce((sum, p) =>
        sum + (p.buyIns * session.buyInAmount), 0
      )

      const auditEntry: AuditEntry = {
        playerId: player.id,
        playerName: player.name,
        action: 'rebuy',
        previousBuyIns: player.buyIns,
        newBuyIns: newBuyIns,
        id: Date.now().toString(),
        timestamp: new Date(),
        totalPot
      }

      setSession(prev => prev ? {
        ...prev,
        auditTrail: [...prev.auditTrail, auditEntry]
      } : null)
    }
  }

  const removePlayer = (playerId: string) => {
    if (!session) return

    const player = session.players.find(p => p.id === playerId)
    if (!player) return

    // Add to audit trail
    addAuditEntry({
      playerId: player.id,
      playerName: player.name,
      action: 'remove_player'
    })

    setSession({
      ...session,
      players: session.players.filter(p => p.id !== playerId)
    })
  }

  const updateFinalAmount = (playerId: string, amount: string) => {
    if (!session) return

    const numAmount = parseFloat(amount) || 0
    setSession({
      ...session,
      players: session.players.map(player =>
        player.id === playerId
          ? { ...player, finalAmount: numAmount }
          : player
      )
    })
  }

  const resetGame = () => {
    localStorage.removeItem('pokerSession')
    setSession(null)
    setGameState('setup')
    setBuyInAmount('20')
  }

  const calculateTotals = () => {
    if (!session) return { totalBuyIns: 0, totalFinal: 0, difference: 0 }

    const totalBuyIns = session.players.reduce((sum, player) => sum + (player.buyIns * session.buyInAmount), 0)
    const totalFinal = session.players.reduce((sum, player) => sum + (player.finalAmount || 0), 0)

    return {
      totalBuyIns,
      totalFinal,
      difference: Math.abs(totalBuyIns - totalFinal)
    }
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  if (gameState === 'setup') {
    return (
      <SetupScreen
        buyInAmount={buyInAmount}
        setBuyInAmount={setBuyInAmount}
        onStartGame={startNewGame}
      />
    )
  }

  if (gameState === 'active' && session) {
    return (
      <ActiveGameScreen
        session={session}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        onAddPlayer={addPlayer}
        onUpdateBuyIns={updateBuyIns}
        onRemovePlayer={removePlayer}
        onGoToLedger={() => setGameState('ledger')}
        onReset={resetGame}
        formatCurrency={formatCurrency}
      />
    )
  }

  if (gameState === 'ledger' && session) {
    return (
      <LedgerScreen
        session={session}
        onUpdateFinalAmount={updateFinalAmount}
        onGoBack={() => setGameState('active')}
        onGoToSummary={() => setGameState('summary')}
        formatCurrency={formatCurrency}
        calculateTotals={calculateTotals}
      />
    )
  }

  if (gameState === 'summary' && session) {
    return (
      <SummaryScreen
        session={session}
        onGoBack={() => setGameState('ledger')}
        onNewGame={() => {
          setSession(null)
          localStorage.removeItem('pokerSession')
          setGameState('setup')
          setBuyInAmount('20')
        }}
        formatCurrency={formatCurrency}
        calculateTotals={calculateTotals}
      />
    )
  }

  return null
}

export default App
