import React, { useState } from 'react'
import './PasswordInput.css'

const PasswordInput = ({ value, onChange, placeholder = 'Password', name }) => {
  const [showPassword, setShowPassword] = useState(false)

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
        onClick={() => setShowPassword(!showPassword)}
      >
        <img
          src={
            showPassword ? '/src/images//visible.png' : '/src/images/hide.png'
          }
          alt={showPassword ? 'Hide password' : 'Show password'}
          className='toggle-icon'
        />
      </button>
    </div>
  )
}

export default PasswordInput
