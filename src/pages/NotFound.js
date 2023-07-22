import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      404 - The requested page was not found. Go back <Link to="/">Home</Link>
    </div>
  )
}

export default NotFound
