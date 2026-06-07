import React from 'react'
import URLForm from '../components/UrlForm'

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          URL Shortener
        </h1>
        <URLForm/>
      </div>
    </div>
  )
}

export default HomePage