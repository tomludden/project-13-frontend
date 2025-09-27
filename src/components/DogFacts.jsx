import { useEffect, useState, useCallback } from 'react'

export function DogFacts() {
  const [fact, setFact] = useState(null)
  const [error, setError] = useState(null)

  const fetchFact = useCallback(async () => {
    try {
      const res = await fetch('https://dogapi.dog/api/v2/facts')
      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      setFact(data?.data?.[0]?.attributes?.body || 'No fact found')
    } catch {
      setError('Could not fetch a dog fact. Please try again later.')
    }
  }, [])

  useEffect(() => {
    fetchFact()
  }, [fetchFact])

  return { fact, error, fetchFact }
}
