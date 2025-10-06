// Hooks/useShopAndAdminSharedLogic.js
import { useProducts } from './useProducts'
import { useFilters } from './useFilters'
import { usePagination } from './usePagination'

export const useShopAndAdminSharedLogic = (pageSize = 8) => {
  const { products, loadingInitial, loadingRest, error } = useProducts()

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
