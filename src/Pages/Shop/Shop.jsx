import { useContext } from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import { useProducts } from '../../hooks/useProducts'
import { useFilters } from '../../hooks/useFilters'
import FilterControls from '../../FilterControls/filterControls.jsx'
import { useFavourites } from '../../hooks/useFavourites'
import { usePagination } from '../../hooks/usePagination'
import PaginationControls from '../../components/PaginationControls/paginationControls.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import SearchBar from '../../components/SearchBar/searchBar'
import DogLoader from '../../components/DogLoader/DogLoader.jsx'
import './Shop.css'

const Shop = () => {
  const { user } = useContext(AuthContext)
  const { products, loading, error } = useProducts()
  const { favourites, toggleFavourite, loadingIds } = useFavourites(user)

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

  const {
    currentPage,
    totalPages,
    paginatedData: currentItems,
    setPage
  } = usePagination(filteredProducts, 8)

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

      {loading && <DogLoader />}
      {error && <p>Error: {error}</p>}

      <div className='products'>
        {currentItems.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isFavourite={favourites.some((f) => f._id === product._id)}
            onToggleFavourite={() => toggleFavourite(product)}
            disabled={loadingIds.includes(product._id)}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        goPrev={() => setPage(currentPage - 1)}
        goNext={() => setPage(currentPage + 1)}
      />
    </div>
  )
}

export default Shop
