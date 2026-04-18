import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function BuilderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const template = location.state?.template

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a2e52] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Resume Builder Coming Soon! 🚀</h1>
        <p className="text-xl text-gray-300 mb-8">
          You selected: <span className="text-[#00d9ff]">{template?.name || 'No template selected'}</span>
        </p>
        <button
          onClick={() => navigate('/templates')}
          className="px-8 py-4 bg-gradient-to-r from-[#ff6b3d] to-[#ff5722] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          ← Back to Templates
        </button>
      </div>
    </div>
  )
}

export default BuilderPage
