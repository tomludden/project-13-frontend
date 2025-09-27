import fs from 'fs'
import stringSimilarity from 'string-similarity'

const NINJA_API_KEY = '9AC3DBl3W4qUNrezYcQ2Nw==ijnhXjVJeRKQBrAw'
const DOG_API_KEY =
  'Ylive_yua2LvO51xYBlOm4TuBHzJJK9oV098kCqjxLs8XD4WrZtrajOdYiveqPMWZzTnVG'

const allDogs = JSON.parse(fs.readFileSync('./mergedDogsFull.json', 'utf-8'))

let ninjaBreedsCache = null
async function loadNinjaBreeds() {
  if (ninjaBreedsCache) return ninjaBreedsCache
  try {
    const res = await fetch('https://api.api-ninjas.com/v1/dogs', {
      headers: { 'X-Api-Key': NINJA_API_KEY }
    })
    ninjaBreedsCache = await res.json()
    return ninjaBreedsCache
  } catch (err) {
    console.error('Failed to load Ninja breeds list:', err.message)
    return []
  }
}

async function fetchNinjaImage(breedName) {
  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/dogs?name=${encodeURIComponent(
        breedName
      )}`,
      {
        headers: { 'X-Api-Key': NINJA_API_KEY }
      }
    )
    const data = await res.json()
    if (data && data[0]?.image_link) return data[0].image_link

    const allBreeds = await loadNinjaBreeds()
    if (!allBreeds.length) return null

    const names = allBreeds.map((b) => b.name)
    const bestMatch = stringSimilarity.findBestMatch(breedName, names)
    const matchedBreed = allBreeds.find(
      (b) => b.name === bestMatch.bestMatch.target
    )

    if (matchedBreed?.image_link) {
      return matchedBreed.image_link
    }

    return null
  } catch (err) {
    console.error('Ninja API error for', breedName, err.message)
    return null
  }
}

async function fetchDogAPIInfo(breedName) {
  try {
    const res = await fetch(
      `https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(
        breedName
      )}`,
      {
        headers: { 'x-api-key': DOG_API_KEY }
      }
    )
    const data = await res.json()
    if (!data || data.length === 0) {
      return {}
    }

    let breed = data[0]
    if (data.length > 1) {
      const names = data.map((b) => b.name)
      const bestMatch = stringSimilarity.findBestMatch(breedName, names)
      breed = data.find((b) => b.name === bestMatch.bestMatch.target) || data[0]
    }

    return {
      weight: breed.weight?.metric || null,
      height: breed.height?.metric || null,
      temperament: breed.temperament || null,
      life_span: breed.life_span || null
    }
  } catch (err) {
    console.error('Dog API error for', breedName, err.message)
    return {}
  }
}

async function mergeDogsFull() {
  const merged = []

  for (const dog of allDogs) {
    const [ninjaImage, dogApiInfo] = await Promise.all([
      fetchNinjaImage(dog.name),
      fetchDogAPIInfo(dog.name)
    ])

    merged.push({
      ...dog,
      image_link: ninjaImage,
      ...dogApiInfo
    })
  }

  fs.writeFileSync('./mergedDogsFull.json', JSON.stringify(merged, null, 2))
}

mergeDogsFull()
