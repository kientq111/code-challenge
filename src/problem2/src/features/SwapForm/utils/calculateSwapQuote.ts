import type { SwapQuote, Token } from '../types'
import { calculateExchangeRate } from './calculateExchangeRate'
import { calculateOutputAmount } from './calculateOutputAmount'
import { hasTokenPrice } from './hasTokenPrice'

export function calculateSwapQuote({
  amount,
  fromToken,
  toToken,
}: {
  amount: number | null
  fromToken?: Token
  toToken?: Token
}): SwapQuote | null {
  if (!amount || !hasTokenPrice(fromToken) || !hasTokenPrice(toToken)) {
    return null
  }

  const exchangeRate = calculateExchangeRate(fromToken, toToken)

  if (!exchangeRate) {
    return null
  }

  const outputAmount = calculateOutputAmount(amount, exchangeRate)

  if (!outputAmount) {
    return null
  }

  const inputValueUsd = amount * fromToken.price
  const outputValueUsd = outputAmount * toToken.price
  const inverseExchangeRate = 1 / exchangeRate
  const valueDeltaPercent =
    inputValueUsd > 0
      ? ((outputValueUsd - inputValueUsd) / inputValueUsd) * 100
      : 0

  if (
    !Number.isFinite(inputValueUsd) ||
    !Number.isFinite(outputValueUsd) ||
    !Number.isFinite(inverseExchangeRate) ||
    !Number.isFinite(valueDeltaPercent)
  ) {
    return null
  }

  return {
    exchangeRate,
    inputAmount: amount,
    inputValueUsd,
    inverseExchangeRate,
    outputAmount,
    outputValueUsd,
    valueDeltaPercent,
  }
}
