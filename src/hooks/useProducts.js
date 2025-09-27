import { useState, useEffect } from 'react'
import { apiFetch } from '../components/apiFetch'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch('/products', { method: 'GET' })

        if (Array.isArray(data)) {
          const normalized = data.map((p) => {
            if (p.price != null) return { ...p, price: Number(p.price) }
            const numericPrice = parseFloat(
              `${p.priceWhole || 0}.${p.priceFraction || '00'}`
            )
            return { ...p, price: numericPrice }
          })
          setProducts(normalized)
        } else if (data && Array.isArray(data.products)) {
          const normalized = data.products.map((p) => {
            if (p.price != null) return { ...p, price: Number(p.price) }
            const numericPrice = parseFloat(
              `${p.priceWhole || 0}.${p.priceFraction || '00'}`
            )
            return { ...p, price: numericPrice }
          })
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
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}
