import { useState, useEffect } from 'react'
import type { GameSession, Player, GameState } from './types'
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

  const startNewGame = () => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      buyInAmount: parseFloat(buyInAmount) || 20,
      players: [],
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
    setNewPlayerName('')
  }

  const updateBuyIns = (playerId: string, change: number) => {
    if (!session) return

    setSession({
      ...session,
      players: session.players.map(player =>
        player.id === playerId
          ? { ...player, buyIns: Math.max(0, player.buyIns + change) }
          : player
      )
    })
  }

  const removePlayer = (playerId: string) => {
    if (!session) return

    setSession({
      ...session,
      players: session.players.filter(player => player.id !== playerId)
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
        onNewGame={resetGame}
        formatCurrency={formatCurrency}
        calculateTotals={calculateTotals}
      />
    )
  }

  return null
}

export default App
