import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Buttons/Button'
import './Home.css'

const Home = () => {
  const [showButtons, setShowButtons] = useState(false)
  const [showFunOptions, setShowFunOptions] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const goTo = useCallback((path) => navigate(path), [navigate])
  const toggleFunOptions = useCallback(() => setShowFunOptions(true), [])

  const mainButtons = useMemo(
    () => (
      <>
        <button className='home-btn' onClick={() => goTo('/shop')}>
          Shop
        </button>
        <button className='home-btn' onClick={toggleFunOptions}>
          Fun Stuff
        </button>
      </>
    ),
    [goTo, toggleFunOptions]
  )

  const funButtons = useMemo(
    () => (
      <div className='fun-options fade-in'>
        <Button onClick={() => goTo('/guess-the-dog')}>Dog Game</Button>
        <Button onClick={() => goTo('/suitable-dog')}>My Perfect Dog</Button>
        <Button onClick={() => goTo('/fun-dog-facts')}>Fun Dog Facts</Button>
      </div>
    ),
    [goTo]
  )

  return (
    <div className='home'>
      <h1>Welcome Dog Lovers!</h1>
      <img
        className='home-img'
        src='./assets/images/home-dog-image.jpg'
        alt='Cute Dog'
      />
      {showButtons && (
        <div className='home-buttons fade-in'>
          {!showFunOptions ? mainButtons : funButtons}
        </div>
      )}
    </div>
  )
}

export default Home
