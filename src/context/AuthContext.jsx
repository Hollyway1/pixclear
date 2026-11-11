
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check whether the user has an active session.
  const checkAuth = useCallback(async () => {
    setLoading(true)

    try {
      const data = await api('/api/auth/me')

      setUser(data.user || null)

      return data.user || null
    } catch (error) {
      setUser(null)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Restore the user's session when the application opens.
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Login user.
  const login = useCallback(async (credentials) => {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (!data.user) {
      throw new Error('Login failed. User information was not returned.')
    }

    setUser(data.user)

    return data.user
  }, [])

  // Register a new user.
  const signup = useCallback(async (userData) => {
    const data = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (!data.user) {
      throw new Error('Registration failed. User information was not returned.')
    }

    setUser(data.user)

    return data.user
  }, [])

  // Logout user.
  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', {
        method: 'POST',
      })
    } finally {
      // Clear local authentication state even if the request fails.
      setUser(null)
    }
  }, [])

  // Shared authentication context.
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    checkAuth,
  }), [
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Access authentication from any component.
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}
