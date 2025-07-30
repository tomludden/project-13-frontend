import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './FunDogFacts.css'

const FunDogFacts = () => {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)
  const [dogImage, setDogImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const showDetails = searchParams.get('showDetails') === 'true'

  const fetchFact = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://dogapi.dog/api/v2/facts')
      const data = await res.json()
      const body = data.data?.[0]?.attributes?.body
      setFact(body || 'No fact found.')
    } catch (error) {
      console.error('Error fetching fact:', error)
      setFact('Could not fetch dog fact right now.')
    } finally {
      setLoading(false)
    }
  }

  const fetchDogImage = async () => {
    setImageLoading(true)
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      setDogImage(data.message)
    } catch (error) {
      console.error('Error fetching image:', error)
      setDogImage('')
    } finally {
      setImageLoading(false)
    }
  }

  const openPopup = () => {
    setSearchParams({ showDetails: 'true' })
  }

  const closePopup = () => {
    setSearchParams({})
    setDogImage('')
  }

  useEffect(() => {
    fetchFact()
  }, [])

  useEffect(() => {
    if (showDetails) {
      fetchDogImage()
    }
  }, [showDetails])

  return (
    <div className='dog-fact-container'>
      <h2>🐾 Did you know?</h2>
      {loading ? <p>Loading...</p> : <p className='dog-fact'>{fact}</p>}
      <button onClick={fetchFact} className='new-fact-btn'>
        New Fact
      </button>
      <button onClick={openPopup} className='fact-details-btn'>
        Fact Details
      </button>

      {showDetails && (
        <div className='popup'>
          <div className='popup-content'>
            <span className='close-btn' onClick={closePopup}>
              &times;
            </span>
            <h3>Fun Dog Fact</h3>
            <p>{fact}</p>
            {imageLoading ? (
              <p>Loading image...</p>
            ) : (
              dogImage && (
                <img src={dogImage} alt='Random Dog' className='dog-image' />
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FunDogFacts
