import React from 'react'
import './Home.css'
import ChatWidget from '/src/components/chatButton/chatButton'

const Home = () => {
  return (
    <div className='home'>
      <h1>Welcome Dog Lovers!</h1>
      <img
        className='home-img'
        src='/assets/home-dog-image.jpg' // assuming public/assets is correct
        alt='Cute Dog'
      />
      <ChatWidget />
    </div>
  )
}

export default Home
