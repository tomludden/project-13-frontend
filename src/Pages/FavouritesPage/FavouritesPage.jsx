import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../components/AuthContext'
import { useFavourites } from '../../Hooks/useFavourites'
import ProductCard from '../../components/ProductCard/ProductCard'
import DogLoader from '../../components/DogLoader/DogLoader'
import './FavouritesPage.css'

const FavouritesPage = () => {
  const { user } = useContext(AuthContext)
  const { favourites, loading, loadingIds, toggleFavourite } = useFavourites()

  const isLoggedIn = Boolean(user?._id)
  const [showEmptyMessage, setShowEmptyMessage] = useState(false)

  useEffect(() => {
    if (!loading && favourites.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyMessage(true)
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowEmptyMessage(false)
    }
  }, [loading, favourites])

  if (!isLoggedIn) {
    return (
      <p className='fav-page-text'>Please log in to see your favourites.</p>
    )
  }

  if (loading) {
    return (
      <main className='favourites-page'>
        <h2>My Favourites</h2>
        <DogLoader />
      </main>
    )
  }

  return (
    <main className='favourites-page'>
      <h2>My Favourites</h2>
      {favourites.length === 0 && showEmptyMessage ? (
        <p className='fav-page-text'>You have no favourites yet.</p>
      ) : (
        <div className='favourites-products'>
          {favourites.map(({ _id, ...rest }) => (
            <ProductCard
              key={_id}
              product={{ _id, ...rest }}
              isFavourite
              onToggleFavourite={toggleFavourite}
              disabled={loadingIds.includes(_id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default FavouritesPage
