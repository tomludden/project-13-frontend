import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    let isMounted = true

    setLoading(true)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then((json) => isMounted && setData(json))
      .catch((err) => isMounted && setError(err))
      .finally(() => isMounted && setLoading(false))

    return () => {
      isMounted = false
    }
  }, [url])

  return { data, loading, error }
}
