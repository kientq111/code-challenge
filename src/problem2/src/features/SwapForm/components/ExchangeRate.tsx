import { Loader2, Radio } from 'lucide-react'

import type { Token } from '../types'
import { formatTokenUpdatedAt } from '../utils/formatDate'
import { formatTokenAmount } from '../utils/formatTokenAmount'

type ExchangeRateProps = {
  exchangeRate: number | null
  fromToken?: Token
  inverseExchangeRate: number | null
  isLoading?: boolean
  toToken?: Token
}

export function ExchangeRate({
  exchangeRate,
  fromToken,
  inverseExchangeRate,
  isLoading,
  toToken,
}: ExchangeRateProps) {
  const rateText =
    exchangeRate && fromToken && toToken
      ? `1 ${fromToken.symbol} = ${formatTokenAmount(
          exchangeRate,
          8,
        )} ${toToken.symbol}`
      : 'Rate unavailable'
  const updatedAt = fromToken?.updatedAt ?? toToken?.updatedAt

  return (
    <div className="mt-4 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 transition">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex min-w-0 items-center gap-2 text-slate-300">
          {isLoading ? (
            <Loader2
              className="size-4 shrink-0 animate-spin text-cyan-200"
              aria-hidden="true"
            />
          ) : (
            <Radio
              className="size-4 shrink-0 text-lime-300"
              aria-hidden="true"
            />
          )}
          <span className="truncate">{rateText}</span>
        </div>
        <span className="shrink-0 text-xs text-slate-500">
          {formatTokenUpdatedAt(updatedAt)}
        </span>
      </div>
      {inverseExchangeRate && fromToken && toToken ? (
        <p className="mt-1 text-xs text-slate-500">
          1 {toToken.symbol} = {formatTokenAmount(inverseExchangeRate, 8)}{' '}
          {fromToken.symbol}
        </p>
      ) : null}
    </div>
  )
}
