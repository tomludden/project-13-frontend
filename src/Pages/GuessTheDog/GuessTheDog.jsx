import './GuessTheDog.css'
import React, {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
  useRef
} from 'react'
import Button from '../../components/Buttons/Button.jsx'
import { gameReducer, initialState } from '../../Reducers/GameReducer.jsx'
import { useLocalStorage } from '../../Hooks/useLocalStorage.js'
import DogLoader from '../../components/DogLoader/DogLoader.jsx'

const STORAGE_KEY = 'dogGameState'

const getBreedFromUrl = (url) => {
  const match = url.match(/breeds\/([^/]+)\//)
  return match ? match[1].replace('-', ' ') : 'Unknown'
}

const GuessTheDog = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [savedState, setSavedState] = useLocalStorage(STORAGE_KEY, initialState)
  const { dogImages, correctBreed, score, lives, gameOver, timer, started } =
    state
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  const fetchDogs = useCallback(async () => {
    setLoading(true)
    const newImages = []
    try {
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
    } catch (err) {
      console.error('Error fetching dog images:', err)
      dispatch({
        type: 'SET_DOGS',
        payload: { images: [], correctBreed: '' }
      })
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (savedState && savedState.started) {
      dispatch({ type: 'LOAD_STATE', payload: savedState })
    }
  }, [])

  useEffect(() => {
    setSavedState(state)
  }, [state, setSavedState])

  useEffect(() => {
    if (started && !gameOver) fetchDogs()
  }, [started, gameOver, fetchDogs])

  const handleGuess = useCallback(
    (imgUrl) => {
      if (gameOver) return
      const breed = getBreedFromUrl(imgUrl)
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

  useEffect(() => {
    if (!started || gameOver) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started, gameOver, dispatch])

  useEffect(() => {
    if (timer <= 0 && started && !gameOver) {
      dispatch({ type: 'GUESS_WRONG' })
      fetchDogs()
    }
  }, [timer, started, gameOver, dispatch, fetchDogs])

  const ScoreLives = useMemo(
    () => (
      <div className='score-lives'>
        <p className='score'>
          Score: <span className='score-num'>{score}</span>
        </p>
        <p className='lives'>
          <span className='heart'>♡</span> <span className='live'>Lives:</span>{' '}
          {lives}
        </p>
      </div>
    ),
    [score, lives]
  )

  const TimerDisplay = useMemo(
    () =>
      !gameOver && (
        <div className='game-timer'>
          <p>Time Remaining: {timer}s</p>
        </div>
      ),
    [gameOver, timer]
  )

  const DogGrid = useMemo(
    () => (
      <div className='dog-grid'>
        {loading ? (
          <DogLoader />
        ) : (
          dogImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Dog ${idx + 1}`}
              className='dog-image'
              onClick={() => handleGuess(img)}
            />
          ))
        )}
      </div>
    ),
    [dogImages, handleGuess, loading]
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
              <Button className='restart-btn' onClick={restartGame}>
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
