import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/AuthContext'
import { showPopup } from '../../components/ShowPopup/showPopup'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { apiFetch } from '../../components/apiFetch'
import './login.css'

const LoginPage = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (ev) => {
    ev.preventDefault()
    if (!userName || !password) {
      showPopup('Username and password are required', 'error')
      return
    }

    setLoading(true)
    console.log('Attempting login with:', { userName })

    try {
      const data = await apiFetch('/users/login', {
        method: 'POST',
        data: { userName, password }
      })

      if (!data.user || !data.token) {
        showPopup('Login failed: incomplete response from server', 'error')
        console.error('Invalid login response:', data)
        return
      }

      localStorage.setItem('token', data.token)

      const loggedInUser = {
        _id: data.user._id,
        userName: data.user.userName,
        email: data.user.email,
        role: data.user.role || 'user',
        favourites: data.user.favourites || [],
        token: data.token
      }

      console.log('Logging in user:', loggedInUser)
      login(loggedInUser)

      showPopup('Logged in successfully', 'success')
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      showPopup(err.message || 'Login failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='loginForm' onSubmit={handleLogin}>
      <input
        className='login-input'
        type='text'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder='Username'
        disabled={loading}
      />

      <PasswordInput
        name='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
        disabled={loading}
      />

      <button className='login-btn' type='submit' disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginPage
