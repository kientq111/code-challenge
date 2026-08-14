const SWAP_AMOUNT_PATTERN = /^(?:\d+|\d+\.\d*|\.\d+)$/
export const MAX_SWAP_DECIMALS = 18
export const MAX_SWAP_AMOUNT = 1_000_000_000_000_000

export function normalizeSwapAmountInput(value: string) {
  const normalizedDecimalSeparator = value.replace(',', '.')
  const amountCharactersOnly = normalizedDecimalSeparator.replace(/[^\d.]/g, '')
  const firstDecimalIndex = amountCharactersOnly.indexOf('.')

  if (firstDecimalIndex === -1) {
    return amountCharactersOnly
  }

  const integerPart = amountCharactersOnly.slice(0, firstDecimalIndex)
  const decimalPart = amountCharactersOnly
    .slice(firstDecimalIndex + 1)
    .replace(/\./g, '')
    .slice(0, MAX_SWAP_DECIMALS)

  return `${integerPart}.${decimalPart}`
}

export function parseSwapAmount(value: string) {
  const trimmedValue = value.trim()

  if (!isValidSwapAmount(trimmedValue)) {
    return null
  }

  const amount = Number(trimmedValue)

  return Number.isFinite(amount) ? amount : null
}

export function isValidSwapAmount(value: string) {
  return (
    SWAP_AMOUNT_PATTERN.test(value.trim()) && Number.isFinite(Number(value))
  )
}

export function countSwapAmountDecimals(value: string) {
  return value.includes('.') ? (value.split('.')[1]?.length ?? 0) : 0
}

export function isSafeSwapAmount(value: string) {
  const amount = Number(value)

  return Number.isFinite(amount) && amount <= MAX_SWAP_AMOUNT
}
