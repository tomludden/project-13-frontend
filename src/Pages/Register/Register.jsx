import React, { useState, useContext, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Buttons/Button'
import { AuthContext } from '../../components/AuthContext'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import FormInput from '../../components/FormInput/FormInput'
import { showPopup } from '../../components/ShowPopup/ShowPopup'
import './Register.css'
import { apiFetch } from '../../components/apiFetch'

const RegisterPage = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleUserNameChange = useCallback(
    (e) => setUserName(e.target.value),
    []
  )
  const handleEmailChange = useCallback((e) => setEmail(e.target.value), [])
  const handlePasswordChange = useCallback(
    (e) => setPassword(e.target.value),
    []
  )

  const payload = useMemo(
    () => ({ userName, email, password }),
    [userName, email, password]
  )

  const handleRegister = useCallback(
    async (ev) => {
      ev.preventDefault()
      if (!userName || !email || !password) {
        showPopup('All fields are required', 'error')
        return
      }

      try {
        const data = await apiFetch('/users/register', {
          method: 'POST',
          data: payload
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
    },
    [userName, email, password, payload, setUser, navigate]
  )

  return (
    <div className='register-container'>
      <h1>Register</h1>
      <form onSubmit={handleRegister} className='register-form'>
        <FormInput
          name='userName'
          value={userName}
          onChange={handleUserNameChange}
          placeholder='Username'
          required
        />
        <FormInput
          name='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Email'
          required
        />

        <PasswordInput
          name='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Password'
        />
        <Button
          className='primary-button 
        register'
          type='submit'
          disabled={loading}
          loading={loading}
          loadingText='Registering...'
        >
          Register
        </Button>
      </form>
    </div>
  )
}

export default RegisterPage
