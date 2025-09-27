import { useCallback } from 'react'

const getBreedFromUrl = (url) => {
  const match = url.match(/breeds\/([^/]+)\//)
  return match ? match[1].replace('-', ' ') : 'Unknown'
}

export const DogImages = (dispatch) => {
  const fetchDogs = useCallback(async () => {
    const newImages = []

    while (newImages.length < 3) {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()
      const breed = getBreedFromUrl(data.message)

      if (!newImages.some((img) => getBreedFromUrl(img) === breed)) {
        newImages.push(data.message)
      }
    }

    const correctIndex = Math.floor(Math.random() * 3)
    const correct = getBreedFromUrl(newImages[correctIndex])

    dispatch({
      type: 'SET_DOGS',
      payload: { images: newImages, correctBreed: correct }
    })
  }, [dispatch])

  return fetchDogs
}
