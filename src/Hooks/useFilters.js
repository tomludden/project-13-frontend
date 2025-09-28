import { useState, useMemo } from 'react'

export const useFilters = (allProducts, setPage) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [size, setSize] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((p) => p.name?.toLowerCase().includes(term))
    }

    if (size) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(size.toLowerCase())
      )
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice)
      filtered = filtered.filter((p) => p.price <= max)
    }

    if (minRating) {
      const min = parseFloat(minRating)
      filtered = filtered.filter((p) => p.rating >= min)
    }

    return filtered
  }, [allProducts, searchTerm, size, maxPrice, minRating])

  const clearFilters = () => {
    setSearchTerm('')
    setSize('')
    setMaxPrice('')
    setMinRating('')
    if (setPage) setPage(1)
  }

  return {
    searchTerm,
    setSearchTerm,
    size,
    setSize,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    filteredProducts,
    clearFilters
  }
}
