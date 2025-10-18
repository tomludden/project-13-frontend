import React, { useState, useMemo, useCallback } from 'react'
import './PasswordInput.css'

const PasswordInput = ({ value, onChange, placeholder = 'Password', name }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const toggleIconSrc = useMemo(() => {
    return showPassword
      ? './assets/images/hide.png'
      : './assets/images/visible.png'
  }, [showPassword])

  const toggleAltText = useMemo(() => {
    return showPassword ? 'Hide password' : 'Show password'
  }, [showPassword])

  return (
    <div className='password-input-wrapper'>
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <button
        type='button'
        className='toggle-password'
        onClick={handleTogglePassword}
      >
        <img src={toggleIconSrc} alt={toggleAltText} className='toggle-icon' />
      </button>
    </div>
  )
}

export default PasswordInput
