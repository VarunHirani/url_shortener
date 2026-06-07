import React ,{useState} from 'react'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
const AuthPage = () => {

  const [login, setLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {login ? <LoginForm state={setLogin}/>: <RegisterForm state={setLogin}/>}
    </div>
  )
}

export default AuthPage