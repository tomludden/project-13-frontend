import { useState, useCallback } from 'react'

export function useDogImage() {
  const [dogImage, setDogImage] = useState('')

  const fetchDogImage = useCallback(async () => {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      setDogImage(data.message)
    } catch (error) {
      console.error('Error fetching image:', error)
      setDogImage('')
    }
  }, [])

  return { dogImage, fetchDogImage, setDogImage }
}
