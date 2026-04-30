import { createContext, useContext } from 'react'

import type { AppConfig, AppUser } from './types'

export interface AppContextType {
  config: AppConfig
  setConfig: (patch: Partial<AppConfig>) => void
  currentUser: AppUser | null
  userLoading: boolean

  paletteOpen: boolean
  setPaletteOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  tweaksOpen: boolean
  setTweaksOpen: (open: boolean) => void

  toggleTheme: () => void
  toggleDensity: () => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

export const AppContext = createContext<AppContextType | null>(null)

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within Shell')
  return ctx
}
