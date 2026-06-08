import { Link } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import URLForm from '../components/UrlForm'

function HomePage() {
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth)

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Simple URL management</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950 dark:text-white sm:text-5xl">
            Short links with tracking, aliases, and clean sharing.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Create memorable short URLs, monitor clicks, and manage every link from one responsive dashboard.
          </p>
          {!isAuthLoading && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="rounded-md bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    search={{ mode: 'register' }}
                    className="rounded-md bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/auth"
                    search={{ mode: 'login' }}
                    className="rounded-md border border-gray-300 px-5 py-3 text-center font-semibold text-gray-800 hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Create a short URL</h2>
          <URLForm/>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 pb-10 sm:grid-cols-3">
        {[
          ['Track URLs', 'See every link you create and monitor click activity.'],
          ['Use aliases', 'Create custom slugs for links that need to be memorable.'],
          ['Share anywhere', 'Copy links quickly and generate QR codes from the dashboard.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default HomePage
