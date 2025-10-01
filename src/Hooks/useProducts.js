import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../components/apiFetch'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const normalizePrice = useCallback((p) => {
    if (p.price != null) return { ...p, price: Number(p.price) }
    const numericPrice = parseFloat(
      `${p.priceWhole || 0}.${p.priceFraction || '00'}`
    )
    return { ...p, price: numericPrice }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/products', { method: 'GET' })
      const items = Array.isArray(data) ? data : data?.products

      if (Array.isArray(items)) {
        const normalized = items.map(normalizePrice)
        setProducts(normalized)
      } else {
        setProducts([])
      }
    } catch (err) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [normalizePrice])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error }
}
