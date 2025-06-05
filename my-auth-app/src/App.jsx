import React, { useState, useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import AuthTabs from './components/AuthTabs'
import Tasks from './components/Tasks'

export default function App() {
  const [token, setToken] = useState(null)
  const logoutTimerRef = useRef(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const expiration = localStorage.getItem('token_expiration')

    if (savedToken && expiration && new Date().getTime() < parseInt(expiration)) {
      setToken(savedToken)
      scheduleAutoLogout(parseInt(expiration) - new Date().getTime())
    } else {
      clearSession()
    }

    return () => clearTimeout(logoutTimerRef.current) // cleanup si se desmonta
  }, [])

  const scheduleAutoLogout = (delay) => {
    logoutTimerRef.current = setTimeout(() => {
      clearSession()
    }, delay)
  }

  const clearSession = () => {
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('token_expiration')
  }

  const handleLoginSuccess = (newToken) => {
    const expiration = new Date().getTime() + 10 * 60 * 1000 // 10 minutos
    localStorage.setItem('token', newToken)
    localStorage.setItem('token_expiration', expiration)
    setToken(newToken)
    scheduleAutoLogout(10 * 60 * 1000)
  }

  const handleLogout = () => {
    clearTimeout(logoutTimerRef.current)
    clearSession()
  }

  return (
    <Box bg="gray.900" minH="100vh" display="flex" justifyContent="center" alignItems="center" p={4}>
      {!token ? (
        <AuthTabs onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Tasks token={token} onLogout={handleLogout} />
      )}
    </Box>
  )
}
