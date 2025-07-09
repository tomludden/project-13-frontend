import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <div className='home'>
      <h1>Welcome Dog Lovers!</h1>
      <img
        className='home-img'
        src='/public/assets/home-dog-image.jpg'
        alt='Cute Dog'
      />
    </div>
  )
}

export default Home
