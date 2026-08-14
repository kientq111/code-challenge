export function calculateOutputAmount(
  inputAmount: number,
  exchangeRate: number,
): number | null {
  if (
    !Number.isFinite(inputAmount) ||
    !Number.isFinite(exchangeRate) ||
    inputAmount <= 0 ||
    exchangeRate <= 0
  ) {
    return null
  }

  const outputAmount = inputAmount * exchangeRate

  return Number.isFinite(outputAmount) && outputAmount > 0 ? outputAmount : null
}
