import { useQuery } from '@tanstack/react-query'

import { fetchTokenPrices } from '../services/tokenPriceApi'

export const tokenPricesQueryKey = ['swap', 'token-prices'] as const

export function useTokenPrices() {
  return useQuery({
    queryKey: tokenPricesQueryKey,
    queryFn: fetchTokenPrices,
  })
}
