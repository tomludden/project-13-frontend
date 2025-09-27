import React from 'react'
import './DogLoader.css'
/* import dogIcon from '/assets/images/dog1.png' */

const DogLoader = () => {
  return (
    <div className='dog-loader-overlay'>
      <img src='images/dog1.png' className='dog-loader-icon' alt='Loading...' />
    </div>
  )
}

export default DogLoader
