import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/AuthContext'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { showPopup } from '../../components/ShowPopup/ShowPopup'
import './register.css'
import { apiFetch } from '../../components/apiFetch'

const RegisterPage = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleRegister = async (ev) => {
    ev.preventDefault()
    if (!userName || !email || !password) {
      showPopup('All fields are required', 'error')
      return
    }

    try {
      const data = await apiFetch('/users/register', {
        method: 'POST',
        data: { userName, email, password }
      })

      const loggedInUser = {
        _id: data.user._id,
        userName: data.user.userName,
        email: data.user.email,
        role: data.user.role || 'user',
        favourites: data.user.favourites || [],
        token: data.token
      }

      setUser(loggedInUser)
      localStorage.setItem('user', JSON.stringify(loggedInUser))

      showPopup('Registration successful', 'success')
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Register error:', err)
      showPopup(
        err.message || 'Registration failed. Please try again.',
        'error'
      )
    }
  }

  return (
    <form onSubmit={handleRegister} id='form'>
      <input
        type='text'
        placeholder='Username'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <PasswordInput
        name='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />

      <button type='submit' id='registerbtn'>
        Register
      </button>
    </form>
  )
}

export default RegisterPage
