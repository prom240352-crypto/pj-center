import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { useInitialization } from './hooks'
import './styles/global.css'
import './styles/welcome.css'

function Root() {
  const { initialized, error } = useInitialization()

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>เกิดข้อผิดพลาด</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!initialized) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>กำลังโหลด...</h1>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
