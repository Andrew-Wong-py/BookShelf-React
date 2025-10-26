import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (process.env.NODE_ENV === 'development') {
  // Prepare MSW in a Service Worker
  import('../mocks/browser')
    .then(async ({ worker }) => {
      return worker.start()
    })
    .then(() => {
      console.log('🚀 MSW is running!')
      root.render(<App />)
    })
    .catch((error) => {
      console.error('Failed to start MSW:', error)
      root.render(<App />)
    })
} else {
  // Production
  root.render(<App />)
}
