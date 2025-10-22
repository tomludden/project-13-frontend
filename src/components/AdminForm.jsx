import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import ProductForm from '../components/ProductForm/ProductForm'
import Modal from '../components/Modal/Modal'
import Footer from '../components/Footer/Footer'

const AdminForm = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const openModal = useCallback((product = null) => {
    setEditingProduct(product)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setEditingProduct(null)
    setShowModal(false)
  }, [])

  return (
    <>
      <Outlet context={{ openModal }} />
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
  )
}

export default AdminForm
