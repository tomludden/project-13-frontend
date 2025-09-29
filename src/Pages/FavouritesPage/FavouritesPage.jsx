import { useContext } from 'react'
import { AuthContext } from '../../components/AuthContext'
import { useFavourites } from '../../Hooks/useFavourites'
import ProductCard from '../../components/ProductCard/ProductCard'
import DogLoader from '../../components/DogLoader/DogLoader'
import './FavouritesPage.css'

const FavouritesPage = () => {
  const { user } = useContext(AuthContext)
  const { favourites, loadingIds, toggleFavourite } = useFavourites()

  if (!user?._id) {
    return (
      <p className='fav-page-text'>Please log in to see your favourites.</p>
    )
  }

  if (loading) {
    return <DogLoader />
  }

  return (
    <div>
      <h2>My Favourites</h2>
      {favourites.length === 0 && (
        <p className='fav-page-text'>You have no favourites yet.</p>
      )}
      <div className='products'>
        {favourites.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            isFavourite={true}
            onToggleFavourite={toggleFavourite}
            disabled={loadingIds.includes(p._id)}
          />
        ))}
      </div>
    </div>
  )
}

export default FavouritesPage
