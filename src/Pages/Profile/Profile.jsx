import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { AuthContext } from '../../components/AuthContext.jsx'
import './Profile.css'
import { showPopup } from '../../components/ShowPopup/ShowPopup.js'
import PasswordInput from '../../components/PasswordInput/PasswordInput.jsx'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../components/apiFetch.js'

const Profile = () => {
  const { user, setUser } = useContext(AuthContext)
  const usernameRef = useRef(null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    if (!user?._id) return
    setFormData({
      userName: user.userName || '',
      email: user.email || '',
      password: '',
      confirmPassword: ''
    })
    usernameRef.current?.focus()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'email') setEmailError('')
  }

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setEmailError('Invalid email format')
      return false
    }
    return true
  }, [formData.email])

  const handleUpdate = async () => {
    if (!validateEmail()) return
    if (formData.password !== formData.confirmPassword) {
      showPopup('Passwords do not match', 'error')
      return
    }

    try {
      setLoading(true)
      const res = await apiFetch(`/users/${user._id}`, {
        method: 'PUT',
        data: formData,
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setUser(res)
      showPopup('Profile updated successfully!', 'success')
      setFormData({
        userName: res.userName || '',
        email: res.email || '',
        password: '',
        confirmPassword: ''
      })
    } catch (err) {
      console.error('Update error:', err)
      showPopup('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await apiFetch(`/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setUser(null)
      localStorage.removeItem('user')
      sessionStorage.clear()
      showPopup('Account deleted successfully', 'success')
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Delete error:', err)
      showPopup('Failed to delete account', 'error')
    } finally {
      setConfirmDelete(false)
    }
  }

  return (
    <div className='profile-container'>
      <h1>My Profile</h1>
      <div className='profile-form'>
        <label>
          Username
          <input
            ref={usernameRef}
            type='text'
            name='userName'
            value={formData.userName}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            onBlur={validateEmail}
          />
          {emailError && <span className='error-text'>{emailError}</span>}
        </label>

        <label>
          New Password
          <PasswordInput
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='New Password'
          />
        </label>

        <label>
          Confirm New Password
          <PasswordInput
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm Password'
          />
        </label>

        <div className='profile-buttons'>
          <button
            className='update-btn'
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Account'}
          </button>
          <button className='delete-btn' onClick={() => setConfirmDelete(true)}>
            Delete Account
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className='modal-overlay' onClick={() => setConfirmDelete(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to delete your account?</p>
            <div className='modal-buttons'>
              <button onClick={() => setConfirmDelete(false)}>No</button>
              <button onClick={handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
