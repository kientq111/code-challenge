export function formatTokenAmount(
  amount: number | null | undefined,
  maximumFractionDigits = 8,
) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(amount)
}

export function formatUsdValue(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: Math.abs(value) < 1 ? 6 : 2,
    style: 'currency',
  }).format(value)
}

export function formatTokenPrice(price: number | null | undefined) {
  return formatUsdValue(price)
}

export function formatPercent(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 2,
    signDisplay: 'exceptZero',
    style: 'percent',
  }).format(value / 100)
}
