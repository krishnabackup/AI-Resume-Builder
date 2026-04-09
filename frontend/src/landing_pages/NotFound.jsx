import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg">Page not found.</p>
        <Link to="/" className="mt-6 inline-block text-blue-600 underline">Go home</Link>
      </div>
    </div>
  )
}
