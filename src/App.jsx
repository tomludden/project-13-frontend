// App.js
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
import DogSearch from './Pages/DogSearch/DogSearch.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Footer from './components/Footer/Footer.jsx'
import Modal from './components/Modal/Modal.jsx'
import ProductForm from './components/ProductForm/ProductForm.jsx'
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx'
import { apiFetch } from './components/apiFetch.js'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState([]) // optional local state
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

  // ✅ handleSave function
  const handleSave = useCallback(
    async ({ name, price, description = '', imageUrl, publicId, url }) => {
      setIsSubmitting(true)
      console.log('handleSave called')

      const payload = {
        ...(editingProduct ? { _id: editingProduct._id } : {}),
        name,
        price,
        description,
        imageUrl,
        publicId,
        url
      }

      console.log('Submitting payload:', payload)

      try {
        const token = localStorage.getItem('token')
        const res = await apiFetch('/products/save', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: payload
        })

        console.log('Raw API response:', res)
        const product = res?.product || res?.data || res

        if (!product?._id) {
          console.error('API did not return a product _id')
          return
        }

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p._id === product._id ? product : p))
          )
        } else {
          setProducts((prev) => [...prev, product])
        }

        closeModal()
      } catch (err) {
        console.error('Error saving product:', err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [editingProduct, closeModal]
  )

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
            <Route path='/dog-search' element={<DogSearch />} />
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
          <ThemeToggle />
          <ChatWidget />
          <Footer openModal={openModal} />
          {showModal && (
            <Modal isOpen={showModal} onClose={closeModal}>
              <ProductForm
                initialData={editingProduct || {}}
                isSubmitting={isSubmitting}
                onCancel={closeModal}
                onSubmit={handleSave}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}

export default App
