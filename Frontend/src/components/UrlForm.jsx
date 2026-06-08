import { useState } from 'react'
import { useSelector } from 'react-redux'
import { createShortUrl } from '../apis/shortUrl.api.js'
import { queryClient } from '../main.jsx'
import { useToast } from '../hooks/useToast.js'

const validateUrl = (value) => {
  try {
    const parsedUrl = new URL(value)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

const URLForm = () => {
  const [url, setUrl] = useState('')
  const [shortUrl,setShortUrl] = useState('')
  const [copied,setCopied] = useState(false)
  const [error,setError] = useState(null)
  const [customSlug,setCustomSlug] = useState('')
  const [loading,setLoading] = useState(false)

  const {isAuthenticated} = useSelector((state)=>state.auth)
  const { showToast } = useToast()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateUrl(url)) {
      const message = 'Please enter a valid http or https URL'
      setError(message)
      showToast(message, 'error')
      return
    }

    if (customSlug && !/^[a-zA-Z0-9_-]{3,40}$/.test(customSlug.trim())) {
      const message = 'Custom slug must be 3-40 characters and use only letters, numbers, hyphens, or underscores'
      setError(message)
      showToast(message, 'error')
      return
    }

    setLoading(true)
    try{
      const createdShortUrl = await createShortUrl(url,customSlug.trim())
      setShortUrl(createdShortUrl)
      setUrl('')
      setCustomSlug('')
      queryClient.invalidateQueries({queryKey: ['userUrls']})
      setError(null)
      showToast('Short URL created successfully')
    }catch(err){
      setError(err.message)
      showToast(err.message || 'Could not create short URL', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      showToast('Short URL copied')
      setTimeout(()=>setCopied(false),2000)
    } catch {
      showToast('Could not copy URL', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Enter your URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(event)=>setUrl(event.target.value)}
          placeholder="https://example.com"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
        />
      </div>

      {isAuthenticated && (
        <div>
          <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Custom URL alias <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="customSlug"
            value={customSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
            placeholder="my-custom-link"
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Your Shortened URL</h2>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                copied
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

export default URLForm
