import React, { useEffect, useReducer } from 'react'
import './GuessTheDog.css'
import { DogImages } from '../../components/DogImages.js'
import { GameTimer } from '../../components/GameTimer.js'
import { gameReducer, initialState } from '../../Reducers/GameReducer.jsx'

const GuessTheDog = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const { dogImages, correctBreed, score, lives, gameOver, timer, started } =
    state

  const fetchDogs = DogImages(dispatch)
  GameTimer({ started, gameOver, timer, dispatch, fetchDogs })
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
      {!started && (
        <p className='game-text'>
          Take the challenge and see how many you can get correct, be careful
          there is a time limit....Good Luck!!
        </p>
      )}

      {!started ? (
        <button className='start-btn' onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <div className='score-lives'>
            <p className='score'>
              Score: <span className='score-num'>{score}</span>
            </p>
            <p className='lives'>
              <span className='heart'>♡</span>{' '}
              <span className='live'>Lives: </span> {lives}
            </p>
          </div>
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
    </div>
  )
}

export default GuessTheDog
