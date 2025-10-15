import React, { useEffect, useReducer, useCallback, useMemo } from 'react'
import './GuessTheDog.css'
import { DogImages } from '../../components/DogImages.js'
import { GameTimer } from '../../components/GameTimer.js'
import { gameReducer, initialState } from '../../Reducers/GameReducer.jsx'
import Button from '../../components/Buttons/Button.jsx'

const STORAGE_KEY = 'guessTheDogProgress'

const GuessTheDog = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { dogImages, correctBreed, score, lives, gameOver, timer, started } =
    state

  const fetchDogs = DogImages(dispatch)
  GameTimer({ started, gameOver, timer, dispatch, fetchDogs })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (started && !gameOver) fetchDogs()
  }, [started, gameOver, fetchDogs])

  const handleGuess = useCallback(
    (imgUrl) => {
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
    },
    [gameOver, correctBreed, lives, fetchDogs]
  )

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const restartGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const ScoreLives = useMemo(
    () => (
      <div className='score-lives'>
        <p className='score'>
          Score: <span className='score-num'>{score}</span>
        </p>
        <p className='lives'>
          <span className='heart'>♡</span> <span className='live'>Lives: </span>{' '}
          {lives}
        </p>
      </div>
    ),
    [score, lives]
  )

  const TimerDisplay = useMemo(
    () =>
      !gameOver && (
        <p className='timer'>
          ⏳ <span className='time'>Time left: </span>
          {timer}s
        </p>
      ),
    [gameOver, timer]
  )

  const DogGrid = useMemo(
    () => (
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
    ),
    [dogImages, handleGuess]
  )

  return (
    <div className='game'>
      <h1>Guess the Dog Breed</h1>

      {!started && (
        <>
          <p className='game-text'>
            Take the challenge and see how many you can get correct, be careful
            there is a time limit....Good Luck!!
          </p>
          <button className='start-btn' onClick={startGame}>
            Start Game
          </button>
        </>
      )}

      {started && (
        <>
          {ScoreLives}
          {TimerDisplay}
          {gameOver ? (
            <>
              <h2 className='game-over'>Game Over!</h2>
              <Button
                variant='secondary'
                className='restart-button'
                onClick={restartGame}
              >
                Restart
              </Button>
            </>
          ) : (
            <>
              <h2>
                Which one is the: <span className='breed'>{correctBreed}</span>?
              </h2>
              {DogGrid}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default GuessTheDog
