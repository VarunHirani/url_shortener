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
      <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Navbar/>
        <Outlet/>
      </div>
    </ToastProvider>
  )
}

export default RootLayout
