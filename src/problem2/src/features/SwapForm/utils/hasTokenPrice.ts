import type { Token } from '../types'

export function hasTokenPrice(
  token?: Token,
): token is Token & { price: number } {
  return (
    typeof token?.price === 'number' &&
    Number.isFinite(token.price) &&
    token.price > 0
  )
}
