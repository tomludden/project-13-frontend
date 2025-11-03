import './Button.css'
import React, { useEffect, useState } from 'react'
import Spinner from '../Spinner/Spinner'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  showSpinner = false,
  loadingText = 'Loading',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`site-button site-button-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span className='button-loading'>
          {showSpinner && <Spinner size={22} />}
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
