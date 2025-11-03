import './FunDogFacts.css'
import React, { useEffect, useState, useCallback } from 'react'
import Button from '../../components/Buttons/Button.jsx'
import Modal from '../../components/Modal/Modal'
import { useModal } from '../../Hooks/useModal.js'
import Spinner from '../../components/Spinner/Spinner.jsx'

export default function FunDogFacts() {
  const [fact, setFact] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(true)
  const { isOpen, openModal, closeModal } = useModal()

  const API_BASE = 'https://dog-facts-api.onrender.com'

  const fetchFactAndImage = useCallback(async () => {
    setLoading(true)
    try {
      const [factRes, imageRes] = await Promise.all([
        fetch(`${API_BASE}/api/dog-fact`),
        fetch('https://dog.ceo/api/breeds/image/random')
      ])
      const factData = await factRes.json()
      const imageData = await imageRes.json()
      setFact(factData.fact || 'No fact found.')
      setImage(imageData.message || '')
    } catch (error) {
      console.error('Error fetching data:', error)
      setFact('Could not fetch dog fact right now.')
      setImage('')
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  const fetchFactOnly = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/dog-fact`)
      const data = await res.json()
      setFact(data.fact || 'No fact found.')
    } catch (error) {
      console.error('Error fetching fact:', error)
      setFact('Could not fetch dog fact right now.')
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  const fetchRandomImage = useCallback(async () => {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      setImage(data.message || '')
    } catch (error) {
      console.error('Error fetching random image:', error)
      setImage('')
    }
  }, [])

  useEffect(() => {
    fetchFactAndImage()
  }, [fetchFactAndImage])

  const openPopup = async () => {
    await fetchRandomImage()
    openModal()
  }

  return (
    <div className='dog-fact-container'>
      <h2 className='dog-fact-header'>Did you know?</h2>

      <div className='dog-fact'>
        {loading ? (
          <div className='loading-dog-fact'>
            <p>Loading dog fact</p>
            <Spinner size={32} />
          </div>
        ) : (
          <p className='fact-text'>{fact}</p>
        )}
      </div>

      <div className='btn-group'>
        <Button
          variant='secondary'
          onClick={fetchFactOnly}
          className='new-fact-btn'
        >
          New Fact
        </Button>
        <Button
          variant='secondary'
          onClick={openPopup}
          className='fact-details-btn'
        >
          Fact Details
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className='popup-content' onClick={(e) => e.stopPropagation()}>
          <span className='fact-close-btn' onClick={closeModal}>
            &times;
          </span>
          <h3>Fun Dog Fact</h3>
          <p>{fact}</p>
          {image && <img src={image} alt='Dog' className='dog-img' />}
        </div>
      </Modal>
    </div>
  )
}
