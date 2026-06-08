import { lazy, Suspense, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import QRCode from 'qrcode'
import { getAllUserUrls } from '../apis/user.api'
import { deleteShortUrl } from '../apis/shortUrl.api.js'
import { useToast } from '../hooks/useToast.js'
import DashboardOverview from './DashboardOverview.jsx'
import Modal from './Modal.jsx'

const shortUrlBase = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/$/, '')
const ClicksChart = lazy(() => import('./ClicksChart.jsx'))

const getShortUrl = (url) => `${shortUrlBase}/${url.short_url}`
const getCreatedTime = (url) => {
  if (url.createdAt) return new Date(url.createdAt).getTime()
  if (url._id && /^[a-f\d]{24}$/i.test(url._id)) {
    return Number.parseInt(url._id.substring(0, 8), 16) * 1000
  }
  return 0
}

const UserUrl = () => {
  const [copiedId, setCopiedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [qrTarget, setQrTarget] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  })

  const urls = useMemo(() => data?.urls || [], [data?.urls])

  const deleteMutation = useMutation({
    mutationFn: deleteShortUrl,
    onSuccess: (response) => {
      showToast(response.message || 'URL deleted successfully')
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['userUrls'] })
    },
    onError: (mutationError) => {
      showToast(mutationError.message || 'Could not delete URL', 'error')
    },
  })

  const filteredUrls = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const matches = urls.filter((url) => {
      if (!term) return true
      return [url.full_url, url.short_url, getShortUrl(url)]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })

    return matches.sort((firstUrl, secondUrl) => {
      if (sortBy === 'oldest') {
        return getCreatedTime(firstUrl) - getCreatedTime(secondUrl)
      }
      if (sortBy === 'most-clicked') {
        return (secondUrl.clicks || 0) - (firstUrl.clicks || 0)
      }
      if (sortBy === 'least-clicked') {
        return (firstUrl.clicks || 0) - (secondUrl.clicks || 0)
      }
      return getCreatedTime(secondUrl) - getCreatedTime(firstUrl)
    })
  }, [searchTerm, sortBy, urls])

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      showToast('Short URL copied')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      showToast('Could not copy URL', 'error')
    }
  }

  const handleQrOpen = async (url) => {
    const shortUrl = getShortUrl(url)
    setQrTarget(url)
    setQrDataUrl('')
    try {
      const dataUrl = await QRCode.toDataURL(shortUrl, {
        margin: 2,
        width: 320,
        color: {
          dark: '#111827',
          light: '#ffffff',
        },
      })
      setQrDataUrl(dataUrl)
    } catch {
      showToast('Could not generate QR code', 'error')
      setQrTarget(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" aria-label="Loading URLs"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        Error loading your URLs: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardOverview urls={urls} />
      <Suspense
        fallback={
          <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            Loading chart...
          </div>
        }
      >
        <ClicksChart urls={urls} />
      </Suspense>

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your URLs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Search, sort, copy, open, export QR codes, or delete your links.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="url-search">Search URLs</label>
            <input
              id="url-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search URLs or slugs"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900 sm:w-64"
            />
            <label className="sr-only" htmlFor="url-sort">Sort URLs</label>
            <select
              id="url-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-clicked">Most Clicked</option>
              <option value="least-clicked">Least Clicked</option>
            </select>
          </div>
        </div>

        {urls.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">No URLs found</p>
            <p className="mt-1">Create your first shortened URL to start tracking clicks.</p>
          </div>
        ) : filteredUrls.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">No matching URLs</p>
            <p className="mt-1">Try a different original URL, short URL, or custom slug.</p>
          </div>
        ) : (
          <div className="grid gap-4 p-5">
            {filteredUrls.map((url) => {
              const shortUrl = getShortUrl(url)
              return (
                <article
                  key={url._id}
                  className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-gray-800 dark:hover:border-blue-900"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {shortUrl}
                      </a>
                      <p className="mt-2 break-all text-sm text-gray-600 dark:text-gray-300">{url.full_url}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                          {url.clicks || 0} {(url.clicks || 0) === 1 ? 'click' : 'clicks'}
                        </span>
                        <span>Slug: {url.short_url}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(shortUrl, url._id)}
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        aria-label={`Copy ${shortUrl}`}
                      >
                        {copiedId === url._id ? 'Copied' : 'Copy'}
                      </button>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => handleQrOpen(url)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(url)}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {deleteTarget && (
        <Modal title="Delete URL" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this short URL? This action cannot be undone.
          </p>
          <p className="mt-3 break-all rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {getShortUrl(deleteTarget)}
          </p>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteMutation.mutate(deleteTarget._id)}
              disabled={deleteMutation.isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete URL'}
            </button>
          </div>
        </Modal>
      )}

      {qrTarget && (
        <Modal title="QR Code" onClose={() => setQrTarget(null)}>
          <div className="space-y-4 text-center">
            <p className="break-all text-sm text-gray-600 dark:text-gray-300">{getShortUrl(qrTarget)}</p>
            <div className="flex min-h-64 items-center justify-center rounded-lg bg-white p-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR code for ${getShortUrl(qrTarget)}`} className="h-64 w-64" />
              ) : (
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
              )}
            </div>
            <a
              href={qrDataUrl}
              download={`${qrTarget.short_url}-qr.png`}
              className={`inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 ${
                qrDataUrl ? '' : 'pointer-events-none opacity-60'
              }`}
            >
              Download QR
            </a>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UserUrl
