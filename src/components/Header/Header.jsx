import React, { useContext, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Header.css'
import { AuthContext } from '../../components/AuthContext.jsx'
import Button from '../Buttons/Button.jsx'
import Hamburger from '../Hamburger/Hamburger.jsx'
import {
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineHome
} from 'react-icons/hi2'

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
              <NavLink
                to='/'
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to='/guess-the-dog'>Guess the Dog</NavLink>
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
                  <Button
                    variant='primary'
                    className='logout-btn'
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              </>
            )}
          </ul>

          {!isLoggedIn && (
            <div className='auth-buttons'>
              <NavLink to='/login'>
                <Button
                  variant='primary'
                  className='header-button'
                  type='submit'
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to='/register'>
                <Button
                  variant='primary'
                  className='header-button'
                  type='submit'
                >
                  Register
                </Button>
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      <div className='mobile-header'>
        <div className='mobile-icons'>
          <NavLink to='/' className='mobile-icon'>
            <HiOutlineHome size={24} />
          </NavLink>
          <NavLink to='/shop' className='mobile-icon'>
            <HiOutlineShoppingBag size={24} />
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink to='/favourites' className='mobile-icon'>
                <HiOutlineHeart size={24} />
              </NavLink>
              <NavLink to='/profile' className='mobile-icon'>
                <HiOutlineUser size={24} />
              </NavLink>
            </>
          )}
        </div>
        <Hamburger />
      </div>
    </>
  )
})

export default Header
