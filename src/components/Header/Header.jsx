import React from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const Header = React.memo(() => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink
              to='/guess-the-dog'
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Dog Game
            </NavLink>
          </li>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          <li>
            <NavLink to='/fun-dog-facts'>Fun Dog Facts</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
})

export default Header
