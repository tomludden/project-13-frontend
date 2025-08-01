import { useEffect, useState } from 'react'

export function useDogFact() {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchFact()
  }, [])

  return { fact, loading, fetchFact }
}
