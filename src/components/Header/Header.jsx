import React, { useContext, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Header.css'
import { AuthContext } from '../../components/AuthContext.jsx'
import Hamburger from '../Hamburger/Hamburger.jsx'
import { FaHeart, FaUser } from 'react-icons/fa'

const Header = React.memo(() => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
  }, [logout, navigate])

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = Boolean(user)

  return (
    <>
      <header className='desktop-header'>
        <nav className='navbar'>
          <ul className='nav-list'>
            <li>
              <NavLink to='/'>Home</NavLink>
            </li>
            <li>
              <NavLink to='/guess-the-dog'>Dog Game</NavLink>
            </li>
            <li>
              <NavLink to='/suitable-dog'>My Perfect Dog</NavLink>
            </li>
            <li>
              <NavLink to='/fun-dog-facts'>Fun Dog Facts</NavLink>
            </li>
            <li>
              <NavLink to='/shop'>Shop</NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <NavLink to='/favourites'>Favourites</NavLink>
                </li>
                <li>
                  <NavLink to='/profile'>Profile</NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to='/admin'>Admin</NavLink>
                  </li>
                )}
                <li>
                  <button className='logout-btn' onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>

          {!isLoggedIn && (
            <div className='auth-buttons'>
              <NavLink to='/login' className='header-btn'>
                Login
              </NavLink>
              <NavLink to='/register' className='header-btn'>
                Register
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      <div className='mobile-header'>
        {isLoggedIn && (
          <div className='mobile-icons'>
            <NavLink to='/favourites' className='mobile-icon'>
              <FaHeart size={24} />
            </NavLink>
            <NavLink to='/profile' className='mobile-icon'>
              <FaUser size={24} />
            </NavLink>
          </div>
        )}
        <Hamburger />
      </div>
    </>
  )
})

export default Header
