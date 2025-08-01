import { useState } from 'react'

export function useDogImage() {
  const [dogImage, setDogImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDogImage = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      setDogImage(data.message)
    } catch (err) {
      setError('Failed to load dog image.')
      setDogImage('')
    } finally {
      setLoading(false)
    }
  }

  return {
    dogImage,
    loading,
    error,
    fetchDogImage,
    clearImage: () => setDogImage('')
  }
}
