import { useEffect, useRef, useState } from 'preact/hooks'
import { DraughtsPlayer, DraughtsStatus } from 'rapid-draughts'
import {
  EnglishDraughts,
  EnglishDraughtsComputerFactory,
  type EnglishDraughtsComputer,
  type EnglishDraughtsGame,
} from 'rapid-draughts/english'

type GameMode = 'computer' | 'local'

export function App() {
  const gameRef = useRef<EnglishDraughtsGame | null>(null)
  const computerRef = useRef<EnglishDraughtsComputer | null>(null)
  if (!gameRef.current) gameRef.current = EnglishDraughts.setup()
  if (!computerRef.current) computerRef.current = EnglishDraughtsComputerFactory.alphaBeta({ maxDepth: 5 })

  const game = gameRef.current
  const [mode, setMode] = useState<GameMode>('computer')
  const [turn, setTurn] = useState(0)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [thinking, setThinking] = useState(false)
  const [computerError, setComputerError] = useState(false)

  useEffect(() => {
    if (mode !== 'computer' || game.player !== DraughtsPlayer.LIGHT || game.status !== DraughtsStatus.PLAYING) return

    let cancelled = false
    setThinking(true)
    setComputerError(false)
    void computerRef.current!(game)
      .then((move) => {
        if (cancelled) return
        game.move(move)
        setSelectedPosition(null)
        setTurn((value) => value + 1)
      })
      .catch(() => {
        if (!cancelled) setComputerError(true)
      })
      .finally(() => {
        if (!cancelled) setThinking(false)
      })

    return () => {
      cancelled = true
    }
  }, [game, mode, turn])

  const humanTurn = mode === 'local' || game.player === DraughtsPlayer.DARK
  const darkPieces = game.board.filter((square) => square.dark && square.piece?.player === DraughtsPlayer.DARK).length
  const lightPieces = game.board.filter((square) => square.dark && square.piece?.player === DraughtsPlayer.LIGHT).length
  const boardSquares = mode === 'computer' ? [...game.board].reverse() : game.board
  const gameOver = game.status !== DraughtsStatus.PLAYING

  function startNewGame(nextMode = mode) {
    gameRef.current = EnglishDraughts.setup()
    setMode(nextMode)
    setSelectedPosition(null)
    setThinking(false)
    setComputerError(false)
    setTurn((value) => value + 1)
  }

  function selectSquare(position: number) {
    if (gameOver || !humanTurn || thinking) return

    const piece = game.board.find((square) => square.dark && square.position === position)?.piece
    const move = selectedPosition === null
      ? undefined
      : game.moves.find((candidate) => candidate.origin === selectedPosition && candidate.destination === position)

    if (move) {
      game.move(move)
      setSelectedPosition(null)
      setTurn((value) => value + 1)
      return
    }

    if (piece?.player === game.player) {
      setSelectedPosition((current) => current === position ? null : position)
      return
    }

    setSelectedPosition(null)
  }

  function statusText() {
    if (game.status === DraughtsStatus.DRAW) return 'Unentschieden'
    if (game.status === DraughtsStatus.DARK_WON) return mode === 'computer' ? 'Du hast gewonnen' : 'Dunkel gewinnt'
    if (game.status === DraughtsStatus.LIGHT_WON) return mode === 'computer' ? 'Der Computer gewinnt' : 'Rot gewinnt'
    if (mode === 'computer' && game.player === DraughtsPlayer.LIGHT) return thinking ? 'Computer denkt nach' : 'Computer ist am Zug'
    return mode === 'computer' ? 'Du bist am Zug' : `${game.player === DraughtsPlayer.DARK ? 'Dunkel' : 'Rot'} ist am Zug`
  }

  return (
    <main class="game-page">
      <header class="game-header">
        <div>
          <p class="game-eyebrow">DAME / 01</p>
          <h1>Checkers</h1>
        </div>
        <button class="new-game-button" type="button" onClick={() => startNewGame()}>
          Neues Spiel
        </button>
      </header>

      <div class="game-layout">
        <section class="board-column" aria-label="Spielbrett">
          <div class="board-frame">
            <div class="checkers-board">
              {boardSquares.map((square, index) => {
                const position = square.dark ? square.position : undefined
                const selected = position !== undefined && selectedPosition === position
                const legalMove = position !== undefined && game.moves.some(
                  (move) => move.origin === selectedPosition && move.destination === position,
                )
                const row = Math.floor(index / 8) + 1
                const column = (index % 8) + 1
                const label = square.piece
                  ? `${square.piece.player === DraughtsPlayer.DARK ? 'Dunkler' : 'Roter'} ${square.piece.king ? 'König' : 'Stein'}`
                  : square.dark ? 'Freies Feld' : 'Helles Feld'

                return (
                  <button
                    key={index}
                    type="button"
                    class={`board-square ${square.dark ? 'square-dark' : 'square-light'}${selected ? ' is-selected' : ''}${legalMove ? ' is-legal' : ''}`}
                    disabled={!square.dark || !humanTurn || gameOver || thinking}
                    aria-label={`${label}, Reihe ${row}, Spalte ${column}`}
                    aria-pressed={selected}
                    onClick={() => position !== undefined && selectSquare(position)}
                  >
                    {square.piece && (
                      <span class={`checker-piece ${square.piece.player === DraughtsPlayer.DARK ? 'piece-dark' : 'piece-light'}${square.piece.king ? ' is-king' : ''}`}>
                        {square.piece.king && <span aria-hidden="true">K</span>}
                      </span>
                    )}
                    {legalMove && !square.piece && <span class="move-marker" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </div>
          <div class="board-caption">
            <span><i class="player-swatch swatch-dark" /> Dunkel</span>
            <span><i class="player-swatch swatch-light" /> Rot</span>
            <span class="move-count">Zug {Math.floor(game.history.moves.length / 2) + 1}</span>
          </div>
        </section>

        <aside class="game-sidebar">
          <div class="mode-control" role="group" aria-label="Spielmodus">
            <button
              type="button"
              class={mode === 'computer' ? 'mode-button is-active' : 'mode-button'}
              aria-pressed={mode === 'computer'}
              onClick={() => mode !== 'computer' && startNewGame('computer')}
            >
              Gegen Computer
            </button>
            <button
              type="button"
              class={mode === 'local' ? 'mode-button is-active' : 'mode-button'}
              aria-pressed={mode === 'local'}
              onClick={() => mode !== 'local' && startNewGame('local')}
            >
              Zu zweit
            </button>
          </div>

          <div class="turn-panel" aria-live="polite">
            <span class={`turn-indicator${gameOver ? ' is-finished' : ''}`} />
            <div>
              <p class="panel-label">PARTIE</p>
              <h2>{statusText()}</h2>
            </div>
          </div>

          {computerError && <p class="game-error" role="alert">Der Computerzug ist fehlgeschlagen. Starte bitte ein neues Spiel.</p>}

          <div class="scoreboard" aria-label="Spielsteine">
            <div class="score-row">
              <span><i class="player-swatch swatch-dark" /> Dunkel</span>
              <strong>{darkPieces}<small> / 12</small></strong>
            </div>
            <div class="score-row">
              <span><i class="player-swatch swatch-light" /> Rot</span>
              <strong>{lightPieces}<small> / 12</small></strong>
            </div>
          </div>

          <div class="sidebar-footer">
            <span>{mode === 'computer' ? 'COMPUTERGEGNER' : 'LOKALES DUELL'}</span>
            <span>{game.history.moves.length} Züge gespielt</span>
          </div>
        </aside>
      </div>
    </main>
  )
}
