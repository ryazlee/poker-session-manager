interface SetupScreenProps {
  buyInAmount: string
  setBuyInAmount: (amount: string) => void
  onStartGame: () => void
}

export default function SetupScreen({ buyInAmount, setBuyInAmount, onStartGame }: SetupScreenProps) {
  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl text-white mb-8">Poker Session Manager</h1>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="number"
          value={buyInAmount}
          onChange={(e) => setBuyInAmount(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 text-white rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Buy-in amount"
        />

        <button
          onClick={onStartGame}
          className="w-full py-3 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  )
}