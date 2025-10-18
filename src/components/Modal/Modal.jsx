import './Modal.css'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-inner' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
