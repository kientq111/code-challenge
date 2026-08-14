export type Token = {
  symbol: string
  name: string
  icon?: string
  price?: number
  updatedAt?: string
}

export type SwapDirection = {
  fromToken?: Token
  toToken?: Token
}

export type SwapField = 'from' | 'to'

export type SwapQuote = {
  exchangeRate: number
  inputAmount: number
  inputValueUsd: number
  inverseExchangeRate: number
  outputAmount: number
  outputValueUsd: number
  valueDeltaPercent: number
}
