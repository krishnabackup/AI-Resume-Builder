import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children, allowedRoles }) {
  const [isChecking, setIsChecking] = useState(true)
  const [hasToken, setHasToken] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check BOTH storages
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')

    const storedRole =
      localStorage.getItem('isAdmin') ||
      sessionStorage.getItem('isAdmin')

    const isAdmin = JSON.parse(storedRole || 'false')

    setHasToken(!!token)

    if (token) {
      // Check if roles are specified and if user matches
      if (allowedRoles && allowedRoles.length > 0) {
        if (allowedRoles.includes('admin') && isAdmin) {
          setIsAuthorized(true)
        } else if (allowedRoles.includes('user')) {
          // Both users and admins can access user pages
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } else {
        // No specific role required, just token
        setIsAuthorized(true)
      }
    }

    setIsChecking(false)
  }, [allowedRoles])

  if (isChecking) {
    return null // Or a loading spinner
  }

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  // If role mismatch
  if (!isAuthorized) {
    const storedRole =
      localStorage.getItem('isAdmin') ||
      sessionStorage.getItem('isAdmin')

    const isAdmin = JSON.parse(storedRole || 'false')

    if (isAdmin) {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/user/dashboard" replace />
    }
  }

  return children
}
