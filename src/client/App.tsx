import { useState } from 'preact/hooks'

type Cell = 'X' | 'O' | null

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(board: Cell[]) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], line: [a, b, c] as number[] }
    }
  }
  return null
}

export function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 })

  const winner = getWinner(board)
  const isDraw = !winner && board.every(Boolean)
  const gameOver = Boolean(winner || isDraw)

  function playMove(index: number) {
    if (board[index] || gameOver) return

    const nextBoard = [...board]
    nextBoard[index] = currentPlayer
    const nextWinner = getWinner(nextBoard)

    if (nextWinner) {
      setScores((value) => ({ ...value, [nextWinner.symbol!]: value[nextWinner.symbol!] + 1 }))
      setBoard(nextBoard)
      return
    }

    if (nextBoard.every(Boolean)) {
      setScores((value) => ({ ...value, draw: value.draw + 1 }))
      setBoard(nextBoard)
      return
    }

    setBoard(nextBoard)
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }

  function newRound() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
  }

  function statusText() {
    if (winner) return `${winner.symbol} gewinnt!`
    if (isDraw) return 'Unentschieden'
    return `${currentPlayer} ist am Zug`
  }

  return (
    <main class="game-page">
      <header class="game-header">
        <div>
          <p class="game-eyebrow">GAMING / 01</p>
          <h1>Tic Tac Toe</h1>
        </div>
        <button class="new-game-button" type="button" onClick={newRound}>
          Neue Runde
        </button>
      </header>

      <div class="game-layout">
        <section class="board-column" aria-label="Tic-Tac-Toe-Spielfeld">
          <div class="board-frame">
            <div class="tic-tac-toe-board">
              {board.map((cell, index) => {
                const isWinning = winner?.line.includes(index) ?? false
                return (
                  <button
                    key={index}
                    type="button"
                    class={`game-cell${cell ? ` has-${cell.toLowerCase()}` : ''}${isWinning ? ' is-winning' : ''}`}
                    aria-label={cell ? `Feld ${index + 1}: ${cell}` : `Feld ${index + 1} frei`}
                    disabled={Boolean(cell) || gameOver}
                    onClick={() => playMove(index)}
                  >
                    {cell && <span>{cell}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <aside class="game-sidebar">
          <div class="turn-panel" aria-live="polite">
            <span class={`turn-indicator${gameOver ? ' is-finished' : ''}`} />
            <div>
              <p class="panel-label">PARTIE</p>
              <h2>{statusText()}</h2>
            </div>
          </div>

          <div class="scoreboard" aria-label="Spielstand">
            <div class="score-row">
              <span><i class="player-swatch swatch-x" /> X</span>
              <strong>{scores.X}</strong>
            </div>
            <div class="score-row">
              <span><i class="player-swatch swatch-o" /> O</span>
              <strong>{scores.O}</strong>
            </div>
            <div class="score-row">
              <span>Unentschieden</span>
              <strong>{scores.draw}</strong>
            </div>
          </div>

          <div class="sidebar-footer">
            <span>LOKALES DUELL · ABWECHSELND</span>
            <button type="button" onClick={() => setScores({ X: 0, O: 0, draw: 0 })}>Stand zurücksetzen</button>
          </div>
        </aside>
      </div>
    </main>
  )
}
