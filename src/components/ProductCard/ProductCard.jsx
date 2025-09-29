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
      radius: { 0: 65 }, // max spread from center
      angle: { 0: 45 },
      y: 0, // no vertical offset
      count: 12,
      children: {
        shape: 'circle',
        radius: 35, // very small dots
        fill: ['red'],
        strokeWidth: 0, // no stroke
        duration: 300
      }
    })

    const burst2 = new mojs.Burst({
      parent: buttonRef.current,
      radius: { 0: 65 },
      angle: { 0: -45 },
      y: 0,
      count: 10,
      children: {
        shape: 'circle',
        radius: 35,
        fill: ['red'],
        strokeWidth: 0,
        duration: 300
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
        <span className='heart-icon'>
          {isFavourite ? (
            <AiFillHeart size={24} />
          ) : (
            <AiOutlineHeart size={24} />
          )}
        </span>
      </button>
    </div>
  )
}

export default ProductCard
