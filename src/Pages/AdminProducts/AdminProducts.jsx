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
import { apiFetch } from '../../components/apiFetch'
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
    async ({ name, price, description, imageUrl, publicId }) => {
      setIsSubmitting(true)
      try {
        const token = localStorage.getItem('token')
        const payload = {
          id: editingProduct?._id,
          name,
          price,
          description,
          imageUrl,
          publicId
        }

        const data = await apiFetch('/products/save', {
          method: 'POST',
          data: payload,
          headers: { Authorization: `Bearer ${token}` }
        })

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p._id === data.product._id ? data.product : p))
          )
          showPopup('Product edited successfully')
        } else {
          setProducts((prev) => [...prev, data.product])
          showPopup('Product added successfully')
        }

        closeModal()
      } catch (err) {
        console.error(err.message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [editingProduct, closeModal, setProducts]
  )

  const confirmDelete = useCallback(async () => {
    setIsDeleting(true)
    const token = localStorage.getItem('token')
    try {
      await apiFetch(`/products/delete/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id))
      closeDeleteModal()
      showPopup('Product deleted successfully')
    } catch (err) {
      console.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }, [selectedProduct, closeDeleteModal, setProducts])

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
              visibleProducts.map((p) => (
                <div key={p._id} className='product-card'>
                  <a
                    href={p.url || '#'}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='product-link'
                  >
                    <img
                      src={p.imageUrl || PLACEHOLDER}
                      alt={p.name}
                      loading='lazy'
                    />
                    <h4>{p.name || 'Unnamed'}</h4>
                  </a>
                  <p>€{Number(p.price).toFixed(2)}</p>
                  {p.rating && <p>Rating: {p.rating} ⭐</p>}
                  <div className='card-buttons'>
                    <Button variant='primary' onClick={() => openModal(p)}>
                      Edit
                    </Button>

                    <Button
                      variant='primary'
                      onClick={() => {
                        openDeleteModal(p)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
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
            className='edit-form'
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
                onClick={confirmDelete}
                loading={isDeleting}
                loadingText='Deleting'
                showSpinner={true}
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
