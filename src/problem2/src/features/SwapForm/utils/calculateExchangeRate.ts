import type { Token } from '../types'
import { hasTokenPrice } from './hasTokenPrice'

export function calculateExchangeRate(
  fromToken?: Token,
  toToken?: Token,
): number | null {
  if (!hasTokenPrice(fromToken) || !hasTokenPrice(toToken)) {
    return null
  }

  if (fromToken.symbol === toToken.symbol) {
    return null
  }

  const exchangeRate = fromToken.price / toToken.price

  return Number.isFinite(exchangeRate) && exchangeRate > 0 ? exchangeRate : null
}
