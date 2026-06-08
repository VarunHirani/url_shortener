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
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        {login ? <LoginForm state={setLogin}/>: <RegisterForm state={setLogin}/>}
    </main>
  )
}

export default AuthPage
