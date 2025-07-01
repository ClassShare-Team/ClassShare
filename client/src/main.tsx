import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // tailwind 스타일 로드

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
