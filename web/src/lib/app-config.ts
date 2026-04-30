import type { AppConfig } from './types'

export interface PageMeta {
  title: string
  sub: string
  crumbs: string[]
}

export const APP_META = {
  name: 'Starter',
  logoMark: 'S',
  tagline: 'full-stack project starter',
  storageKey: 'starter-config',
} as const

export const APP_ROUTES = {
  home: '/',
  profile: '/profile',
  team: '/team',
} as const

export const DEFAULT_APP_CONFIG = {
  accent: 160,
  font: 'inter',
  density: 'comfortable',
  sidebar: 'labeled',
  theme: 'dark',
} satisfies AppConfig

export const PAGE_META: Record<string, PageMeta> = {
  [APP_ROUTES.home]: {
    title: 'Component Catalog',
    sub: 'Every component, form, overlay, and visualization in the design system - rendered live.',
    crumbs: [APP_META.name, 'Catalog'],
  },
  [APP_ROUTES.profile]: {
    title: 'Profile Settings',
    sub: 'Manage your nickname, identity, and the account details synced from social login and stored in Postgres.',
    crumbs: [APP_META.name, 'Profile'],
  },
  [APP_ROUTES.team]: {
    title: 'Roster',
    sub: 'All registered operators synced from the backend auth database.',
    crumbs: [APP_META.name, 'Roster'],
  },
}

export const APP_NAV_ITEMS = [
  {
    id: 'home',
    label: 'Catalog',
    icon: 'dashboard',
    path: APP_ROUTES.home,
    commandLabel: 'Go to Catalog',
    shortcut: 'G H',
    requiresAuth: false,
  },
  {
    id: 'team',
    label: 'Roster',
    icon: 'team',
    path: APP_ROUTES.team,
    commandLabel: 'Go to Roster',
    shortcut: 'G T',
    requiresAuth: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'settings',
    path: APP_ROUTES.profile,
    commandLabel: 'Go to Profile',
    shortcut: 'G P',
    requiresAuth: true,
  },
] as const

export const AUTH_UI = {
  provider: 'google',
  providerName: 'Google',
  callbackURL: APP_ROUTES.home,
  postSignOutPath: APP_ROUTES.home,
  profilePath: APP_ROUTES.profile,
  checkingSessionLabel: 'Checking session',
  checkingSessionTitle: 'Checking session...',
  signedOutTitle: 'No operator signed in',
  signedOutDescription: 'Sync your nickname and avatar from backend auth.',
  signInLabel: 'Sign in with Google',
  signingOutLabel: 'Signing out...',
  signOutLabel: 'Sign out',
} as const

export const API_ENDPOINTS = {
  auth: '/api/auth',
  me: '/api/me',
  users: '/api/users',
  nickname: '/api/me/nickname',
} as const

export const QUERY_DEFAULTS = {
  staleTimeMs: 1000 * 60,
  retry: 1,
  refetchOnWindowFocus: false,
} as const
