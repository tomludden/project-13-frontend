import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './ProductForm.css'

const PLACEHOLDER = './assets/images/placeholder.png'

function DropZone({ handleFileChange }) {
  const fileInputRef = useRef(null)

  return (
    <div
      className='drop-zone'
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFileChange({ target: { files: e.dataTransfer.files } })
      }}
      onClick={() => fileInputRef.current.click()}
    >
      <p>
        Drag & drop an image here, or{' '}
        <span className='browse-link'>browse</span>
      </p>
      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
      />
    </div>
  )
}

export default function ProductForm({
  initialData = {},
  onSubmit,
  isSubmitting,
  onCancel
}) {
  const [name, setName] = useState(initialData.name || '')
  const [price, setPrice] = useState(initialData.price || '')
  const [preview, setPreview] = useState(initialData.imageUrl || '')
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '')
  const [publicId, setPublicId] = useState(initialData.imagePublicId || '')
  const [uploading, setUploading] = useState(false)
  const previewUrlRef = useRef(null)

  useEffect(() => {
    setName(initialData.name || '')
    setPrice(initialData.price || '')
    setPreview(initialData.imageUrl || '')
    setImageUrl(initialData.imageUrl || '')
    setPublicId(initialData.imagePublicId || '')
  }, [initialData])

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const localUrl = URL.createObjectURL(file)
    previewUrlRef.current = localUrl
    setPreview(localUrl)

    setUploading(true)
    try {
      const cloudName = import.meta.env.VITE_CLOUD_NAME
      const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()

      if (data.secure_url) {
        setImageUrl(data.secure_url)
        setPublicId(data.public_id)
        setPreview(data.secure_url)
      }
    } catch {
      alert('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, price, imageUrl, publicId })
  }

  const previewSrc = useMemo(() => preview || PLACEHOLDER, [preview])

  const submitLabel = useMemo(() => {
    if (uploading) return 'Uploading...'
    if (isSubmitting) return 'Saving...'
    return initialData._id ? 'Save' : 'Add'
  }, [uploading, isSubmitting, initialData._id])

  const MemoizedDropZone = useMemo(
    () => <DropZone handleFileChange={handleFileChange} />,
    [handleFileChange]
  )

  return (
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <form className='edit-form' onSubmit={handleSubmit}>
        <h3>{initialData._id ? 'Edit' : 'Add'} Product</h3>

        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type='number'
          step='0.01'
          placeholder='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {MemoizedDropZone}

        <div className='preview-image'>
          <img
            src={previewSrc}
            alt='Preview'
            onError={(e) => (e.target.src = PLACEHOLDER)}
          />
        </div>

        <div className='modal-buttons'>
          <button type='submit' disabled={isSubmitting || uploading}>
            {submitLabel}
          </button>
          <button type='button' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
