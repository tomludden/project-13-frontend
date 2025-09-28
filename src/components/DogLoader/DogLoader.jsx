import React from 'react'
import './DogLoader.css'

const DogLoader = () => {
  return (
    <div className='dog-loader-overlay'>
      <img
        src='./assets/images/dog1.png'
        className='dog-loader-icon'
        alt='Loading...'
      />
    </div>
  )
}

export default DogLoader
