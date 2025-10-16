import React from 'react'
import './Modal.css'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      {children}
    </div>
  )
}
