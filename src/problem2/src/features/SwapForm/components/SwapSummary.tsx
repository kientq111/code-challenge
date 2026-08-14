import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

import type { Token } from '../types'
import { formatTokenAmount } from '../utils/formatTokenAmount'

type SwapSummaryProps = {
  canReview: boolean
  errorMessage?: string
  fromToken?: Token
  inputAmount: number | null
  isLoading?: boolean
  outputAmount: number | null
  reviewMessage?: string | null
  toToken?: Token
}

export function SwapSummary({
  canReview,
  errorMessage,
  fromToken,
  inputAmount,
  isLoading,
  outputAmount,
  reviewMessage,
  toToken,
}: SwapSummaryProps) {
  return (
    <div className="mt-4 space-y-3">
      <dl className="rounded-[8px] border border-white/10 bg-[#0f131b]/80 px-4 py-3 text-sm">
        <SummaryRow
          label="You pay"
          value={
            inputAmount && fromToken
              ? `${formatTokenAmount(inputAmount)} ${fromToken.symbol}`
              : '-'
          }
        />
        <SummaryRow
          label="You receive"
          value={
            outputAmount && toToken
              ? `${formatTokenAmount(outputAmount)} ${toToken.symbol}`
              : '-'
          }
        />
      </dl>

      {errorMessage ? (
        <div
          aria-live="polite"
          className="flex items-start gap-2 rounded-[8px] border border-rose-300/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-100"
          role="status"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {reviewMessage ? (
        <div
          aria-live="polite"
          className="flex animate-[swap-fade-up_220ms_ease-out] items-start gap-2 rounded-[8px] border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-sm text-lime-100"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{reviewMessage}</p>
        </div>
      ) : null}

      <button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-cyan-300 px-4 font-semibold text-[#061018] shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
        disabled={!canReview}
        type="submit"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLoading ? 'Reviewing swap' : 'Review swap'}
      </button>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium text-slate-200">
        {value}
      </dd>
    </div>
  )
}
