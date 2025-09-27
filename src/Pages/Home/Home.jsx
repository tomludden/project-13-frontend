import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const [showButtons, setShowButtons] = useState(false)
  const [showFunOptions, setShowFunOptions] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='home'>
      <h1>Welcome Dog Lovers!</h1>

      <img
        className='home-img'
        src='/src/images/home-dog-image.jpg'
        alt='Cute Dog'
      />

      {showButtons && (
        <div className='home-buttons fade-in'>
          {!showFunOptions ? (
            <>
              <button className='home-btn' onClick={() => navigate('/shop')}>
                Shop
              </button>
              <button
                className='home-btn'
                onClick={() => setShowFunOptions(true)}
              >
                Fun Stuff
              </button>
            </>
          ) : (
            <div className='fun-options fade-in'>
              <button onClick={() => navigate('/guess-the-dog')}>
                Dog Game
              </button>
              <button onClick={() => navigate('/dog-questionnaire')}>
                My Perfect Dog
              </button>
              <button onClick={() => navigate('/fun-dog-facts')}>
                Fun Dog Facts
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
