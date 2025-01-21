import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameContextProvider } from './hooks/useGame.tsx'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameContextProvider>
      <App />       
    </GameContextProvider>
  </React.StrictMode>,
)
