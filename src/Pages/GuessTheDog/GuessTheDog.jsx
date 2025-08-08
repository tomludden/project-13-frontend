import React, { useEffect, useReducer } from 'react'
import './GuessTheDog.css'
import { useDogImages } from '/src/components/useDogImages.js'
import { useGameTimer } from '/src/components/useGameTimer.js'
import ChatWidget from '/src/components/chatButton/chatButton'

const initialState = {
  dogImages: [],
  correctBreed: '',
  score: 0,
  lives: 5,
  gameOver: false,
  timer: 5,
  started: false
}

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, started: true }
    case 'SET_DOGS':
      return {
        ...state,
        dogImages: action.payload.images,
        correctBreed: action.payload.correctBreed,
        timer: 5
      }
    case 'GUESS_CORRECT':
      return { ...state, score: state.score + 1, timer: 5 }
    case 'GUESS_WRONG':
      const newLives = state.lives - 1
      return {
        ...state,
        lives: newLives,
        gameOver: newLives <= 0,
        timer: 5
      }
    case 'TICK':
      return { ...state, timer: state.timer - 1 }
    case 'RESET_GAME':
      return { ...initialState, started: true }
    default:
      return state
  }
}

const Game = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { dogImages, correctBreed, score, lives, gameOver, timer, started } =
    state

  const fetchDogs = useDogImages(dispatch)
  useGameTimer({ started, gameOver, timer, dispatch, fetchDogs })

  useEffect(() => {
    if (started && !gameOver) {
      fetchDogs()
    }
  }, [started, gameOver, fetchDogs])

  const handleGuess = (imgUrl) => {
    if (gameOver) return
    const breed =
      imgUrl.match(/breeds\/([^/]+)\//)?.[1]?.replace('-', ' ') ?? ''
    if (breed === correctBreed) {
      dispatch({ type: 'GUESS_CORRECT' })
      fetchDogs()
    } else {
      dispatch({ type: 'GUESS_WRONG' })
      if (lives > 1) fetchDogs()
    }
  }

  const startGame = () => dispatch({ type: 'START_GAME' })
  const restartGame = () => dispatch({ type: 'RESET_GAME' })

  return (
    <div className='game'>
      <h1>Guess the Dog Breed</h1>
      {!started ? (
        <button className='start-btn' onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <p className='score'>
            Score: <span className='score-num'>{score}</span>
          </p>
          <p className='lives'>
            <span className='heart'>♡</span>{' '}
            <span className='live'>Lives: </span> {lives}
          </p>
          {!gameOver && (
            <p className='timer'>
              ⏳ <span className='time'>Time left: </span>
              {timer}s
            </p>
          )}

          {gameOver ? (
            <>
              <h2 className='game-over'>Game Over!</h2>
              <button className='restart-btn' onClick={restartGame}>
                Restart
              </button>
            </>
          ) : (
            <>
              <h2>
                Which one is the: <span className='breed'>{correctBreed}</span>?
              </h2>
              <div className='dog-grid'>
                {dogImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt='dog'
                    className='dog-image'
                    onClick={() => handleGuess(img)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
      <ChatWidget />
    </div>
  )
}

export default Game
