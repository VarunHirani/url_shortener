import UrlForm from '../components/UrlForm.jsx'
import UserUrl from '../components/UserUrl.jsx'

const DashboardPage = () => {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Manage your shortened URLs</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              Create links, track clicks, share QR codes, and keep your aliases organized.
            </p>
          </div>
          <UrlForm/>
        </section>
        <UserUrl/>
      </div>
    </main>
  )
}

export default DashboardPage
