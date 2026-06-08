import { Link } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import URLForm from '../components/UrlForm'

function HomePage() {
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          URL Shortener
        </h1>
        <URLForm/>
        {!isAuthLoading && (
          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Sign in to track URLs, view click statistics, and manage your shortened links.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/auth"
                    search={{ mode: 'login' }}
                    className="flex-1 rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    search={{ mode: 'register' }}
                    className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
