interface SetupScreenProps {
  buyInAmount: string
  setBuyInAmount: (amount: string) => void
  onStartGame: () => void
}

export default function SetupScreen({ buyInAmount, setBuyInAmount, onStartGame }: SetupScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">🃏</h1>
        <h2 className="text-xl font-medium text-slate-300">Poker Session</h2>
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Buy-in Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              value={buyInAmount}
              onChange={(e) => setBuyInAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="20"
            />
          </div>
        </div>

        <button
          onClick={onStartGame}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors touch-manipulation"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}