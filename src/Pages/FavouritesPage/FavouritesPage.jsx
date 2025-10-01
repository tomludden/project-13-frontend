import { useContext, useMemo } from 'react'
import { AuthContext } from '../../components/AuthContext'
import { useFavourites } from '../../Hooks/useFavourites'
import ProductCard from '../../components/ProductCard/ProductCard'
import DogLoader from '../../components/DogLoader/DogLoader'
import './FavouritesPage.css'

const FavouritesPage = () => {
  const { user } = useContext(AuthContext)
  const { favourites, loading, loadingIds, toggleFavourite } = useFavourites()

  const isLoggedIn = Boolean(user?._id)

  const FavouriteList = useMemo(() => {
    if (favourites.length === 0) {
      return <p className='fav-page-text'>You have no favourites yet.</p>
    }

    return (
      <div className='products'>
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
    )
  }, [favourites, toggleFavourite, loadingIds])

  if (!isLoggedIn) {
    return (
      <p className='fav-page-text'>Please log in to see your favourites.</p>
    )
  }

  if (loading) {
    return <DogLoader />
  }

  return (
    <main className='favourites-page'>
      <h2>My Favourites</h2>
      {FavouriteList}
    </main>
  )
}

export default FavouritesPage
