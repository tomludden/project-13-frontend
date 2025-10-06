import { useContext } from 'react'
import { AuthContext } from '../../components/AuthContext'
import { useFavourites } from '../../Hooks/useFavourites'
import { useShopAndAdminSharedLogic } from '../Hooks/useShopAndAdminSharedLogic'
import ProductGrid from '../../components/productGrid'
import { useShopAndAdminSharedLogic } from '../../Hooks/useShopAndAdminSharedLogic'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls'

const Shop = () => {
  const { user } = useContext(AuthContext)
  const { favourites, toggleFavourite, loadingIds } = useFavourites(user)

  return (
    <div>
      <h1>Dog Lovers Shop!</h1>
      useShopAndAdminSharedLogic() SearchBar() FilterControls() ProductGrid()
    </div>
  )
}

export default Shop
