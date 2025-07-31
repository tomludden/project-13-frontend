import React, { useEffect, useReducer, useRef } from 'react'
import './GuessTheDog.css'

const getBreedFromUrl = (url) => {
  const match = url.match(/breeds\/([^/]+)\//)
  return match ? match[1].replace('-', ' ') : 'Unknown'
}

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
      return {
        ...state,
        score: state.score + 1,
        timer: 5
      }
    case 'GUESS_WRONG':
      const newLives = state.lives - 1
      return {
        ...state,
        lives: newLives,
        gameOver: newLives <= 0,
        timer: 5
      }
    case 'TICK':
      return {
        ...state,
        timer: state.timer - 1
      }
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
  const timerRef = useRef(null)

  const fetchDogs = async () => {
    const newImages = []

    while (newImages.length < 3) {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      const breed = getBreedFromUrl(data.message)

      if (!newImages.some((img) => getBreedFromUrl(img) === breed)) {
        newImages.push(data.message)
      }
    }

    const correctIndex = Math.floor(Math.random() * 3)
    const correct = getBreedFromUrl(newImages[correctIndex])

    dispatch({
      type: 'SET_DOGS',
      payload: { images: newImages, correctBreed: correct }
    })
  }

  useEffect(() => {
    if (started && !gameOver) {
      fetchDogs()
    }
  }, [started, gameOver])

  useEffect(() => {
    if (!started || gameOver || dogImages.length === 0) return

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [dogImages, gameOver, started])

  useEffect(() => {
    if (timer <= 0 && started && !gameOver) {
      dispatch({ type: 'GUESS_WRONG' })
      fetchDogs()
    }
  }, [timer, gameOver, started])

  const handleGuess = (imgUrl) => {
    if (gameOver) return

    const guessed = getBreedFromUrl(imgUrl)

    if (guessed === correctBreed) {
      dispatch({ type: 'GUESS_CORRECT' })
      fetchDogs()
    } else {
      dispatch({ type: 'GUESS_WRONG' })
      if (lives > 1) {
        fetchDogs()
      }
    }
  }

  const restartGame = () => {
    dispatch({ type: 'RESET_GAME' })
  }

  const startGame = () => {
    dispatch({ type: 'START_GAME' })
  }

  return (
    <div className='game'>
      <h1>Guess the Dog Breed</h1>

      {!started ? (
        <button className='start-btn' onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <p className='score'>Score: {score}</p>
          <p className='lives'>❤️ Lives: {lives}</p>
          {!gameOver && <p className='timer'>⏱ Time left: {timer}s</p>}

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

export default Game
