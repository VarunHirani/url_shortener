const DashboardOverview = ({ urls }) => {
  const totalUrls = urls.length
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0)
  const mostClicked = urls.reduce((topUrl, url) => {
    if (!topUrl || (url.clicks || 0) > (topUrl.clicks || 0)) return url
    return topUrl
  }, null)
  const averageClicks = totalUrls ? (totalClicks / totalUrls).toFixed(1) : '0.0'

  const stats = [
    { label: 'Total URLs', value: totalUrls },
    { label: 'Total Clicks', value: totalClicks },
    { label: 'Most Clicked', value: mostClicked ? mostClicked.short_url : 'None' },
    { label: 'Average Clicks', value: averageClicks },
  ]

  return (
    <section aria-label="Dashboard overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-white" title={String(stat.value)}>
            {stat.value}
          </p>
        </article>
      ))}
    </section>
  )
}

export default DashboardOverview
