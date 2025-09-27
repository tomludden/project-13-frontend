import fs from 'fs'
import fetch from 'node-fetch'
import stringSimilarity from 'string-similarity'

const API_KEY =
  'live_yua2LvO51xYBlOm4TuBHzJJK9oV098kCqjxLs8XD4WrZtrajOdYiveqPMWZzTnVG'

const localBreeds = JSON.parse(fs.readFileSync('dog_breeds.json', 'utf-8'))

async function mergeIds() {
  const res = await fetch('https://api.thedogapi.com/v1/breeds', {
    headers: { 'x-api-key': API_KEY }
  })
  const apiBreeds = await res.json()

  const apiNames = apiBreeds.map((b) => b.name)

  const merged = localBreeds.map((dog) => {
    const dogName = dog.name
    const match = stringSimilarity.findBestMatch(dogName, apiNames).bestMatch

    let id = null
    if (match.rating >= 0.6) {
      const matchedBreed = apiBreeds.find((b) => b.name === match.target)
      id = matchedBreed?.id ?? null
    }

    return { id, ...dog }
  })

  fs.writeFileSync('dog_breeds_with_ids.json', JSON.stringify(merged, null, 2))
}

mergeIds().catch((err) => console.error('Error:', err))
