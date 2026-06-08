import { useEffect } from 'react'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useSelector } from 'react-redux'

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const params = new URLSearchParams(location.searchStr)
  const login = params.get('mode') !== 'register'

  const setLogin = (showLogin) => {
    navigate({
      to: '/auth',
      search: { mode: showLogin ? 'login' : 'register' },
      replace: true,
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {login ? <LoginForm state={setLogin}/>: <RegisterForm state={setLogin}/>}
    </div>
  )
}

export default AuthPage
