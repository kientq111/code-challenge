import { createBrowserRouter } from 'react-router-dom'

import { SwapPage } from '../pages/SwapPage'

export const ROUTE_PATHS = {
  SWAP_PAGE: '/',
} as const

export const ROUTES = {
  SWAP_PAGE: {
    path: ROUTE_PATHS.SWAP_PAGE,
    element: <SwapPage />,
  },
} as const

const ROUTE_CONFIGS = Object.values(ROUTES)

export const router = createBrowserRouter(ROUTE_CONFIGS)
