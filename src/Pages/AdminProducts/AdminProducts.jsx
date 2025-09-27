import { useState, useEffect } from 'react'
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

const PLACEHOLDER = '/placeholder.png'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

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
    fetchProducts()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, size, maxPrice, minRating, setPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await apiFetch('/products', { method: 'GET' })
      const items = Array.isArray(data) ? data : data.products
      setProducts(items || [])
    } catch (err) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (product = null) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const closeModal = () => {
    setEditingProduct(null)
    setShowModal(false)
  }

  const openDeleteModal = (product) => {
    setSelectedProduct(product)
    setDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setSelectedProduct(null)
    setDeleteModal(false)
  }

  const handleSave = async ({
    name,
    price,
    description,
    imageUrl,
    publicId
  }) => {
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
  }

  const confirmDelete = async () => {
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
    }
  }

  return (
    <div className='admin-products'>
      <h2>Admin Dashboard</h2>

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

      <button className='add-btn' onClick={() => openModal()}>
        +
      </button>

      {loading ? (
        <DogLoader />
      ) : (
        <>
          <div className='product-list'>
            {visibleProducts.length > 0 ? (
              visibleProducts.map((p) => (
                <div key={p._id} className='product-card'>
                  <img
                    src={p.imageUrl || PLACEHOLDER}
                    alt={p.name}
                    loading='lazy'
                  />
                  <h4>{p.name}</h4>
                  <p>€{Number(p.price).toFixed(2)}</p>
                  {p.rating && <p>Rating: {p.rating} ⭐</p>}
                  <div className='card-buttons'>
                    <button onClick={() => openModal(p)}>Edit</button>
                    <button onClick={() => openDeleteModal(p)}>Delete</button>
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
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <ProductForm
              className='edit-form'
              initialData={editingProduct || {}}
              isSubmitting={isSubmitting}
              onCancel={closeModal}
              onSubmit={handleSave}
            />
          </div>
        </div>
      )}

      {deleteModal && (
        <div className='modal-overlay' onClick={closeDeleteModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{selectedProduct?.name}</strong>?
            </p>
            <div className='modal-buttons'>
              <button className='confirm-btn' onClick={confirmDelete}>
                Delete
              </button>
              <button className='cancel-btn' onClick={closeDeleteModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
