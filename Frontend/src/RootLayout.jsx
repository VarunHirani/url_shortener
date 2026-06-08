import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import Navbar from './components/NavBar.jsx'
import { useDispatch } from 'react-redux'
import { finishAuthLoading, login, logout } from './store/slice/authSlice.js'
import { getCurrentUser } from './apis/user.api.js'
import { ToastProvider } from './components/Toast.jsx'

const RootLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          dispatch(login(user))
          return
        }
        dispatch(finishAuthLoading())
      } catch {
        dispatch(logout())
      }
    }

    initializeAuth()
  }, [dispatch])

  return (
    <ToastProvider>
      <Navbar/>
      <Outlet/>
    </ToastProvider>
  )
}

export default RootLayout
