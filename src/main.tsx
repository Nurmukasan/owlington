import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Keep these two in step with src/auth/seed.ts (imported lazily, so not imported here).
const SEED_KEY = 'owlington:seed'
const SEED_VERSION = 1

/** The demo people are added once per browser, before anyone can log in. */
async function seedIfNeeded() {
  try {
    if (Number(localStorage.getItem(SEED_KEY)) >= SEED_VERSION) return
  } catch {
    return
  }
  const { seedDemo } = await import('./auth/seed')
  await seedDemo()
}

seedIfNeeded().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
