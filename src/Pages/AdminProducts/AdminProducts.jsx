import './AdminProducts.css'
import { useState, useCallback } from 'react'
import { useSharedProducts } from '../../Hooks/useSharedProducts'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterControls from '../../FilterControls/FilterControls'
import ProductGrid from '../../components/productGrid'
import DogLoader from '../../components/DogLoader/DogLoader'
import ProductForm from '../../components/ProductForm/ProductForm'
import { apiFetch } from '../../components/apiFetch'
import { showPopup } from '../../components/ShowPopup/ShowPopup'

const AdminProducts = () => {
  const {
    products,
    setProducts,
    paginatedData,
    loadingInitial,
    error,
    searchTerm,
    setSearchTerm,
    size,
    setSize,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    clearFilters,
    currentPage,
    totalPages,
    setPage
  } = useSharedProducts()

  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

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
    async (formData) => {
      const token = localStorage.getItem('token')
      try {
        const response = await apiFetch('/products/save', {
          method: 'POST',
          data: { ...formData, id: editingProduct?._id },
          headers: { Authorization: `Bearer ${token}` }
        })

        const updatedProduct = response.data || formData

        setProducts((prev) =>
          editingProduct
            ? prev.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
              )
            : [...prev, updatedProduct]
        )

        showPopup(editingProduct ? 'Product edited' : 'Product added')
        closeModal()
      } catch (err) {
        console.error(err.message)
      }
    },
    [editingProduct, closeModal, setProducts]
  )

  const confirmDelete = useCallback(async () => {
    const token = localStorage.getItem('token')
    try {
      await apiFetch(`/products/delete/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id))

      showPopup('Product deleted')
      closeDeleteModal()
    } catch (err) {
      console.error(err.message)
    }
  }, [selectedProduct, closeDeleteModal, setProducts])

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

      {loadingInitial && <DogLoader />}
      {error && <p>Error: {error}</p>}

      <ProductGrid
        products={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
        onEdit={openModal}
        onDelete={openDeleteModal}
        isAdmin={true}
      />

      {showModal && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <ProductForm
              initialData={editingProduct || {}}
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
              Delete <strong>{selectedProduct?.name}</strong>?
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
