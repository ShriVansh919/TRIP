import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')

function renderFallback(error) {
  console.error('App failed to start', error)
  if (!rootEl) return
  rootEl.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;background:#05070d;color:#f5f8ff;font-family:'Sora','Plus Jakarta Sans',sans-serif;text-align:center;padding:24px;">
      <div style="max-width:520px;border:1px solid rgba(255,255,255,0.18);border-radius:14px;padding:20px;background:rgba(10,12,20,0.9);">
        <div style="font-size:18px;font-weight:700;margin-bottom:6px;">We hit a snag starting the app.</div>
        <div style="color:#b3c0dd;font-size:14px;line-height:1.5;">${error?.message || 'Unexpected error'}</div>
      </div>
    </div>
  `
}

try {
  if (!rootEl) throw new Error('Root container not found')
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  renderFallback(error)
}
