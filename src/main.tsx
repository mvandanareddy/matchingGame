import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MemoryGame from './components/MemoryGame.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="bg-green-100 w-full h-full">
      <MemoryGame />
    </div>
  </StrictMode>,
)
