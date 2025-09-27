import React, { useContext, useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../AuthContext.jsx'
import { FaBars } from 'react-icons/fa'
import './Hamburger.css'

const Hamburger = () => {
  const { user, logout } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleLinkClick = () => setMenuOpen(false)
  const handleLogout = () => {
    logout()
    handleLinkClick()
  }

  return (
    <>
      <div
        ref={buttonRef}
        className='hamburger-btn'
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <FaBars size={28} />
      </div>

      <ul ref={menuRef} className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        <li className='close-btn'>
          <button
            className='close-btn-hamburger'
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </li>

        <li>
          <NavLink to='/' onClick={handleLinkClick}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to='/guess-the-dog' onClick={handleLinkClick}>
            Dog Game
          </NavLink>
        </li>
        <li>
          <NavLink to='/suitable-dog' onClick={handleLinkClick}>
            My Perfect Dog
          </NavLink>
        </li>
        <li>
          <NavLink to='/fun-dog-facts' onClick={handleLinkClick}>
            Fun Dog Facts
          </NavLink>
        </li>
        <li>
          <NavLink to='/shop' onClick={handleLinkClick}>
            Shop
          </NavLink>
        </li>

        {user ? (
          <>
            <li>
              <NavLink to='/favourites' onClick={handleLinkClick}>
                Favourites
              </NavLink>
            </li>
            <li>
              <NavLink to='/profile' onClick={handleLinkClick}>
                Profile
              </NavLink>
            </li>
            <li>
              {user?.role === 'admin' && (
                <NavLink to='/admin' onClick={handleLinkClick}>
                  Admin
                </NavLink>
              )}
            </li>
            <li>
              <button className='logout-btn' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to='/login' onClick={handleLinkClick}>
                <button className='header-btn'>Login</button>
              </NavLink>
            </li>
            <li>
              <NavLink to='/register' onClick={handleLinkClick}>
                <button className='header-btn'>Register</button>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </>
  )
}

export default Hamburger
