import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import './FunDogFacts.css'
import { DogFacts } from '../../components/DogFacts'
import { DogImage } from '../../components/DogImage'
import DogLoader from '../../components/DogLoader/DogLoader'

const FunDogFacts = () => {
  const { fact, error, loading: factLoading, fetchFact } = DogFacts()
  const {
    dogImage,
    fetchDogImage,
    setDogImage,
    loading: imageLoading
  } = DogImage()

  const [searchParams, setSearchParams] = useSearchParams()
  const showDetails = searchParams.get('showDetails') === 'true'
  const popupRef = useRef(null)

  const openPopup = useCallback(
    () => setSearchParams({ showDetails: 'true' }),
    [setSearchParams]
  )
  const closePopup = useCallback(() => {
    setSearchParams({})
    setDogImage('')
  }, [setSearchParams, setDogImage])

  useEffect(() => {
    if (showDetails) fetchDogImage()
  }, [showDetails, fetchDogImage])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup()
      }
    }

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDetails, closePopup])

  const FactDisplay = useMemo(
    () => (factLoading ? <DogLoader /> : <p className='dog-fact'>{fact}</p>),
    [factLoading, fact]
  )

  const PopupContent = useMemo(
    () => (
      <div className='popup'>
        <div className='popup-content' ref={popupRef}>
          <span className='close-btn-popup' onClick={closePopup}>
            &times;
          </span>
          <h3>Fun Dog Fact</h3>
          {imageLoading ? (
            <DogLoader />
          ) : dogImage ? (
            <img src={dogImage} alt='Random Dog' className='dog-image' />
          ) : null}
          <p>{fact}</p>
        </div>
      </div>
    ),
    [imageLoading, dogImage, fact, closePopup]
  )

  return (
    <div className='dog-fact-container'>
      <h2>🐾 Did you know?</h2>
      {FactDisplay}
      <button onClick={fetchFact} className='new-fact-btn'>
        New Fact
      </button>
      <button onClick={openPopup} className='fact-details-btn'>
        Fact Details
      </button>
      {showDetails && PopupContent}
    </div>
  )
}

export default FunDogFacts
