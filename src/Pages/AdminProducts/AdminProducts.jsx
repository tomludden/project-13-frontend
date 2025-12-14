import { useState, useCallback, useEffect } from 'react'
import { useProducts } from '../../Hooks/useProducts'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls.jsx'
import { useFilters } from '../../Hooks/useFilters.js'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import { usePagination } from '../../Hooks/usePagination.js'
import ProductForm from '../../components/ProductForm/ProductForm'
import DogLoader from '../../components/DogLoader/DogLoader'
import './AdminProducts.css'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import Button from '../../components/Buttons/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'

const PLACEHOLDER = './assets/images/placeholder.png'

const AdminProducts = () => {
  const { products, setProducts, loading, error } = useProducts()
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
    paginatedData: visibleProducts,
    totalPages,
    currentPage,
    setPage
  } = usePagination(filteredProducts, 8)

  useEffect(() => {
    setPage(1)
  }, [searchTerm, size, maxPrice, minRating, setPage])

  const openModal = useCallback((product = null) => {
    setEditingProduct(product)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingProduct(null)
    setShowModal(false)
  }, [])

  const openDeleteModal = useCallback((product) => {
    setSelectedProduct(product)
    setDeleteModal(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setSelectedProduct(null)
    setDeleteModal(false)
  }, [])

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

      console.log('Submitting payload to API:', payload)

      try {
        const token = localStorage.getItem('token')
        console.log('Token:', token)

        const res = await apiFetch('/products/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })

        console.log('API response status:', res.status)
        const text = await res.text()
        console.log('API raw response:', text)

        let data
        try {
          data = JSON.parse(text)
        } catch (err) {
          console.error('Failed to parse API response JSON:', err)
          showPopup('Failed to save product', 'error')
          return
        }

        const product = data?.product || data?.data || data
        if (!product?._id) {
          console.error('API did not return a product _id')
          showPopup('Failed to save product', 'error')
          return
        }

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p._id === product._id ? product : p))
          )
          showPopup('Product edited successfully')
        } else {
          setProducts((prev) => [...prev, product])
          showPopup('Product added successfully')
        }

        closeModal()
      } catch (err) {
        console.error('Error saving product:', err)
        showPopup('Failed to save product', 'error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [editingProduct, closeModal, setProducts]
  )

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setPage(1)
  }, [clearFilters, setPage])

  return (
    <div className='admin-products'>
      <h1>Admin Dashboard</h1>

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
        clearFilters={handleClearFilters}
      />

      <button className='admin-add-btn' onClick={() => openModal()}>
        +
      </button>

      {loading ? (
        <DogLoader />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className='product-list'>
            {visibleProducts.length > 0 ? (
              visibleProducts.filter(Boolean).map((p) => {
                if (!p?._id) return null
                return (
                  <div key={p._id} className='admin-product-card'>
                    <img
                      src={p?.imageUrl || PLACEHOLDER}
                      alt={p?.name || 'Unnamed'}
                      loading='lazy'
                    />
                    <div className='admin-product-card-info'>
                      <a
                        href={p?.url || '#'}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='product-link'
                      >
                        <h4>{p?.name || 'Unnamed'}</h4>
                      </a>
                      <p>€{Number(p?.price || 0).toFixed(2)}</p>
                      {p?.rating && <p>Rating: {p.rating} ⭐</p>}
                      <div className='card-buttons'>
                        <Button variant='primary' onClick={() => openModal(p)}>
                          Edit
                        </Button>
                        <Button
                          variant='primary'
                          onClick={() => openDeleteModal(p)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p>No products found.</p>
            )}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            goPrev={() => setPage(currentPage - 1)}
            goNext={() => setPage(currentPage + 1)}
          />
        </>
      )}

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

      {deleteModal && (
        <Modal isOpen={deleteModal} onClose={closeDeleteModal}>
          <div className='modal-content'>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{selectedProduct?.name}</strong>?
            </p>
            <div className='modal-buttons'>
              <Button
                variant='secondary'
                className='confirm-btn'
                onClick={() => {}}
                loading={isDeleting}
                loadingText='Deleting'
                showSpinner
              >
                Delete
              </Button>
              <Button
                variant='primary'
                className='cancel-btn'
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminProducts
