import React from 'react'
import './DogLoader.css'
import dogIcon from './public/dog1.png'

const DogLoader = () => {
  return (
    <div className='dog-loader-overlay'>
      <img src={dogIcon} className='dog-loader-icon' alt='Loading...' />
    </div>
  )
}

export default DogLoader
