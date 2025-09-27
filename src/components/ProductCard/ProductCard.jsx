import React, { useContext, useRef } from 'react'
import mojs from '@mojs/core'
import { AuthContext } from '/src/components/AuthContext'
import { showPopup } from '../ShowPopup/ShowPopup.js'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import './ProductCard.css'

const ProductCard = ({ product, isFavourite, onToggleFavourite }) => {
  const { user } = useContext(AuthContext)
  const buttonRef = useRef(null)

  const handleFavouriteClick = () => {
    if (!user?._id || !user?.token) {
      showPopup('You must be logged in to add favourites', 'error')
      return
    }

    if (!isFavourite) {
      animateHeart()
    }

    onToggleFavourite(product)
  }

  const animateHeart = () => {
    if (!buttonRef.current) return

    const scaleCurve = mojs.easing.path(
      'M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0'
    )

    const burst1 = new mojs.Burst({
      parent: buttonRef.current,
      radius: { 0: 100 },
      angle: { 0: 45 },
      y: -10,
      count: 10,
      children: {
        shape: 'circle',
        radius: 20,
        fill: ['red', 'transparent'],
        strokeWidth: 10,
        duration: 500
      }
    })

    const burst2 = new mojs.Burst({
      parent: buttonRef.current,
      radius: { 0: 125 },
      angle: { 0: -45 },
      y: -10,
      count: 10,
      children: {
        shape: 'circle',
        radius: 20,
        fill: ['transparent', 'red'],
        strokeWidth: 10,
        duration: 400
      }
    })

    const scaleTween = new mojs.Tween({
      duration: 900,
      onUpdate: (progress) => {
        const scaleProgress = scaleCurve(progress)
        buttonRef.current.style.transform = `scale3d(${scaleProgress}, ${scaleProgress}, 1)`
      }
    })

    const timeline = new mojs.Timeline()
    timeline.add(burst1, burst2, scaleTween)
    timeline.play()
  }

  return (
    <div className='product-card'>
      <a
        href={product.url || '#'}
        target='_blank'
        rel='noopener noreferrer'
        className='product-link'
      >
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
        <h4>{product.name || 'Unnamed'}</h4>
      </a>

      <p>Price: €{product.price?.toFixed(2) || '0.00'}</p>
      {product.rating && <p className='rating'>Rating: {product.rating} ⭐️</p>}

      <button
        ref={buttonRef}
        onClick={handleFavouriteClick}
        className={`heart-btn ${isFavourite ? 'active' : ''}`}
      >
        {isFavourite ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
      </button>
    </div>
  )
}

export default ProductCard
