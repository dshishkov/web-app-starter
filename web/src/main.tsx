import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import Shell from './components/Shell'
import './index.css'
import { APP_ROUTES } from './lib/app-config'
import { queryClient } from './lib/query-client'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Team from './pages/Team'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path={APP_ROUTES.home} element={<Home />} />
            <Route element={<RequireAuth />}>
              <Route path={APP_ROUTES.profile} element={<Profile />} />
              <Route path={APP_ROUTES.team} element={<Team />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
