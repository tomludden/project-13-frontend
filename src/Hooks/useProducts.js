import { useState, useEffect } from 'react'
import { apiFetch } from '../components/apiFetch'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingRest, setLoadingRest] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInitial = async () => {
      setError(null)
      try {
        const data = await apiFetch('/products?page=1&limit=8', {
          method: 'GET'
        })
        const items = Array.isArray(data) ? data : data.products || []
        setProducts(items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingInitial(false)
      }
    }

    const fetchRest = async () => {
      try {
        const data = await apiFetch('/products?page=2&limit=1000', {
          method: 'GET'
        })
        const items = Array.isArray(data) ? data : data.products || []
        setProducts((prev) => [...prev, ...items])
      } catch (err) {
        console.error('Background fetch failed:', err.message)
      } finally {
        setLoadingRest(false)
      }
    }

    fetchInitial().then(() => {
      setLoadingRest(true)
      fetchRest()
    })
  }, [])

  return {
    products,
    loading: loadingInitial || loadingRest,
    loadingInitial,
    loadingRest,
    error
  }
}
