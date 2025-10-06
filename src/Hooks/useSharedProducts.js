import { useProducts } from './useProducts'
import { useFilters } from './useFilters'
import { usePagination } from './usePagination'

export const useSharedProducts = (pageSize = 8) => {
  const { products, setProducts, loadingInitial, loadingRest, error } =
    useProducts()

  const {
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
  } = useFilters(products)

  const { currentPage, totalPages, paginatedData, setPage } = usePagination(
    filteredProducts,
    pageSize
  )

  return {
    products,
    setProducts,
    filteredProducts,
    paginatedData,
    loadingInitial,
    loadingRest,
    error,
    searchTerm,
    setSearchTerm,
    size,
    setSize,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    clearFilters,
    currentPage,
    totalPages,
    setPage
  }
}
