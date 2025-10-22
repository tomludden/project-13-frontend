import { Route, Routes, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
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
import Footer from './components/Footer/Footer.jsx'
import Modal from './components/Modal/Modal.jsx'
import ProductForm from './components/ProductForm/ProductForm.jsx'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoading(false)
      return
    }
    const handleLoad = () => setLoading(false)
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  const openModal = useCallback((product = null) => {
    setEditingProduct(product)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingProduct(null)
    setShowModal(false)
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
                  <AdminProducts openModal={openModal} />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ChatWidget />
          <Footer openModal={openModal} />
          {showModal && (
            <Modal isOpen={showModal} onClose={closeModal}>
              <ProductForm
                initialData={editingProduct || {}}
                onCancel={closeModal}
                onSubmit={closeModal}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}

export default App
