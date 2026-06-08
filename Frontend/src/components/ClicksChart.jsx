import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ClicksChart = ({ urls }) => {
  const chartData = urls
    .slice()
    .sort((firstUrl, secondUrl) => (secondUrl.clicks || 0) - (firstUrl.clicks || 0))
    .slice(0, 12)
    .map((url) => ({
      name: url.short_url,
      clicks: url.clicks || 0,
    }))

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Clicks per URL</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Showing up to 12 URLs with the most clicks.</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-56 items-center justify-center rounded-md bg-gray-50 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          Create URLs to see click activity here.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={60} angle={-25} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="clicks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default ClicksChart
