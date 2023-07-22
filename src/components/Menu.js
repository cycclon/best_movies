import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <nav className="main-menu">
      <ul className='menu'>
        <li className='menu'><Link to='/'>Home</Link></li>
        <li className='menu'><Link to='/about'>About</Link></li>
      </ul>
    </nav>
  )
}

export default Menu