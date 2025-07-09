import React, { useEffect, useState } from 'react'
import './GuessTheDog.css'

const getBreedFromUrl = (url) => {
  const match = url.match(/breeds\/([^/]+)\//)
  return match ? match[1].replace('-', ' ') : 'Unknown'
}

const Game = () => {
  const [dogImages, setDogImages] = useState([])
  const [correctBreed, setCorrectBreed] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(5)
  const [gameOver, setGameOver] = useState(false)

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

    setDogImages(newImages)

    const correctIndex = Math.floor(Math.random() * 3)
    setCorrectBreed(getBreedFromUrl(newImages[correctIndex]))
  }

  useEffect(() => {
    if (!gameOver) {
      fetchDogs()
    }
  }, [gameOver])

  const handleGuess = (imgUrl) => {
    if (gameOver) return

    const guessedBreed = getBreedFromUrl(imgUrl)

    if (guessedBreed === correctBreed) {
      setScore((prev) => prev + 1)
      fetchDogs()
    } else {
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        setGameOver(true)
      } else {
        fetchDogs()
      }
    }
  }

  const restartGame = () => {
    setScore(0)
    setLives(5)
    setGameOver(false)
  }

  return (
    <div className='game'>
      <h1>Guess the Dog Breed</h1>
      <p className='score'>Score: {score}</p>
      <p className='lives'>❤️ Lives: {lives}</p>

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
    </div>
  )
}

export default Game
