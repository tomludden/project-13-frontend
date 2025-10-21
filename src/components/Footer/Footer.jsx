import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineHome
} from 'react-icons/hi2'
import { AuthContext } from '../AuthContext.jsx'
import './Footer.css'

const Footer = () => {
  const { user } = useContext(AuthContext)
  const isLoggedIn = Boolean(user)

  return (
    <footer className='footer-container'>
      <div className='footer-links'>
        <NavLink to='/' className='mobile-icon'>
          <HiOutlineHome size={32} />
        </NavLink>
        <NavLink to='/shop' className='mobile-icon'>
          <HiOutlineShoppingBag size={32} />
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink to='/favourites' className='mobile-icon'>
              <HiOutlineHeart size={32} />
            </NavLink>
            <NavLink to='/profile' className='mobile-icon'>
              <HiOutlineUser size={32} />
            </NavLink>
          </>
        )}
      </div>
    </footer>
  )
}

export default Footer
