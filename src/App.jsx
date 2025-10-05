import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import Home from './Pages/Home/Home.jsx'
import GuessTheDog from './Pages/GuessTheDog/GuessTheDog.jsx'
import FunDogFacts from './Pages/FunDogFacts/FunDogFacts.jsx'
import ChatWidget from './components/ChatButton/ChatButton.jsx'
import DogLoader from './components/DogLoader/DogLoader.jsx'
import SuitableDog from './Pages/SuitableDog/SuitableDog.jsx'
import Shop from './Pages/Shop/Shop.jsx'
import Hamburger from './components/Hamburger/Hamburger.jsx'
import RegisterPage from './Pages/Register/Register.jsx'
import LoginPage from './Pages/Login/Login.jsx'
import FavouritesPage from './Pages/FavouritesPage/FavouritesPage.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import AdminProducts from './Pages/AdminProducts/AdminProducts.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoading(false)
      return
    }

    const handleLoad = () => setLoading(false)
    window.addEventListener('load', handleLoad)

    return () => window.removeEventListener('load', handleLoad)
  }, [])

  return (
    <div>
      <Header />
      <Hamburger />
      {loading && <DogLoader />}
      {!loading && (
        <>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/guess-the-dog' element={<GuessTheDog />} />
            <Route path='/fun-dog-facts' element={<FunDogFacts />} />
            <Route path='/suitable-dog' element={<SuitableDog />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/favourites' element={<FavouritesPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route
              path='/admin'
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ChatWidget />
        </>
      )}
    </div>
  )
}

export default App
