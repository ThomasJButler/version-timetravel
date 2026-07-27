import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Archive } from '@/routes/Archive'
import '@/styles/globals.css'

// Split so VT323 and the rain canvas cost the archive page nothing.
const Viewer = lazy(() => import('@/routes/Viewer').then((m) => ({ default: m.Viewer })))

const root = document.getElementById('root')
if (!root) throw new Error('#root missing from index.html')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Archive />} />
        <Route
          path="/v/:id"
          element={
            <Suspense fallback={<div className="h-dvh bg-canvas" />}>
              <Viewer />
            </Suspense>
          }
        />
        <Route path="*" element={<Archive />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
