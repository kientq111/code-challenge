import { getJson } from '../../../lib/http'
import {
  FEATURED_TOKEN_SYMBOLS,
  TOKEN_ICON_BASE_URL,
  TOKEN_NAME_BY_SYMBOL,
  TOKEN_PRICE_API_URL,
} from '../constants'
import type { Token } from '../types'

type RawTokenPrice = {
  currency?: unknown
  price?: unknown
  date?: unknown
}

type NormalizedTokenPrice = {
  currency: string
  date?: string
  price?: number
}

type TokenPriceResponse = RawTokenPrice[]

export async function fetchTokenPrices(): Promise<Token[]> {
  const prices = await getJson<TokenPriceResponse>(TOKEN_PRICE_API_URL)

  if (!Array.isArray(prices)) {
    throw new Error('Token price API returned an invalid payload')
  }

  const latestBySymbol = new Map<string, NormalizedTokenPrice>()
  const normalizedPrices = prices
    .map(normalizeTokenPrice)
    .filter((token): token is NormalizedTokenPrice => Boolean(token))

  for (const token of normalizedPrices) {
    if (!token.currency) {
      continue
    }

    const existingToken = latestBySymbol.get(token.currency)

    if (!existingToken || isNewerTokenPrice(token, existingToken)) {
      latestBySymbol.set(token.currency, token)
    }
  }

  return Array.from(latestBySymbol.values())
    .map((token) => ({
      symbol: token.currency,
      name: TOKEN_NAME_BY_SYMBOL[token.currency] ?? token.currency,
      icon: `${TOKEN_ICON_BASE_URL}/${encodeURIComponent(token.currency)}.svg`,
      price: token.price,
      updatedAt: token.date,
    }))
    .sort(sortTokens)
}

function normalizeTokenPrice(
  token: RawTokenPrice,
): NormalizedTokenPrice | null {
  if (typeof token !== 'object' || token === null) {
    return null
  }

  const currency =
    typeof token.currency === 'string' ? token.currency.trim() : ''
  const price = Number(token.price)
  const date = typeof token.date === 'string' ? token.date : undefined

  if (!currency) {
    return null
  }

  return {
    currency,
    date,
    price: Number.isFinite(price) && price > 0 ? price : undefined,
  }
}

function isNewerTokenPrice(
  token: NormalizedTokenPrice,
  existingToken: NormalizedTokenPrice,
) {
  const tokenTime = Date.parse(token.date ?? '')
  const existingTokenTime = Date.parse(existingToken.date ?? '')
  const tokenHasPrice = typeof token.price === 'number'
  const existingTokenHasPrice = typeof existingToken.price === 'number'

  if (tokenHasPrice && !existingTokenHasPrice) {
    return true
  }

  if (!tokenHasPrice && existingTokenHasPrice) {
    return false
  }

  if (!Number.isFinite(tokenTime) || !Number.isFinite(existingTokenTime)) {
    return true
  }

  return tokenTime >= existingTokenTime
}

function sortTokens(firstToken: Token, secondToken: Token) {
  const firstFeaturedIndex = FEATURED_TOKEN_SYMBOLS.indexOf(firstToken.symbol)
  const secondFeaturedIndex = FEATURED_TOKEN_SYMBOLS.indexOf(secondToken.symbol)
  const firstIsFeatured = firstFeaturedIndex !== -1
  const secondIsFeatured = secondFeaturedIndex !== -1

  if (firstIsFeatured && secondIsFeatured) {
    return firstFeaturedIndex - secondFeaturedIndex
  }

  if (firstIsFeatured) {
    return -1
  }

  if (secondIsFeatured) {
    return 1
  }

  return firstToken.symbol.localeCompare(secondToken.symbol)
}
