import { useContext } from 'react'
import { AuthContext } from '../components/AuthContext'
import { useFavourites } from '../Hooks/useFavourites'
import { useSharedProducts } from '../Hooks/useSharedProducts'
import SearchBar from '../components/SearchBar/SearchBar'
import FilterControls from '../FilterControls/FilterControls'
import ProductGrid from '../components/ProductGrid'
import DogLoader from '../components/DogLoader/DogLoader'

const Shop = () => {
  const { user } = useContext(AuthContext)
  const { favourites, toggleFavourite, loadingIds } = useFavourites(user)
  const {
    paginatedData,
    loadingInitial,
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
  } = useSharedProducts()

  return (
    <div>
      <h1>Dog Lovers Shop!</h1>

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search products...'
      />

      <FilterControls
        size={size}
        setSize={setSize}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        clearFilters={() => {
          clearFilters()
          setPage(1)
        }}
      />

      {loadingInitial && <DogLoader />}
      {error && <p>Error: {error}</p>}

      <ProductGrid
        products={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  )
}

export default Shop
