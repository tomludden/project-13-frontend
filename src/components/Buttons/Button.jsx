import React from 'react'
import './Button.css'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
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
      {loading ? loadingText : children}
    </button>
  )
}

export default Button
