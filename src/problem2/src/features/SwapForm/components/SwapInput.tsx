import { TokenSelector } from './TokenSelector'
import type { Token } from '../types'

type SwapInputProps = {
  error?: string
  id: string
  isTokenLoading?: boolean
  isTokenSelectorOpen?: boolean
  label: string
  onTokenClick: () => void
  onValueChange?: (value: string) => void
  readOnly?: boolean
  token?: Token
  usdValue?: string
  value: string
}

export function SwapInput({
  error,
  id,
  isTokenLoading,
  isTokenSelectorOpen,
  label,
  onTokenClick,
  onValueChange,
  readOnly,
  token,
  usdValue,
  value,
}: SwapInputProps) {
  const inputErrorId = `${id}-error`

  return (
    <div
      className={[
        'rounded-[8px] border bg-[#10141d]/95 p-4 transition',
        error
          ? 'border-rose-300/60 shadow-[0_0_0_1px_rgba(253,164,175,0.12)]'
          : 'border-white/10 hover:border-white/15',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-400" htmlFor={id}>
          {label}
        </label>
        <span className="min-w-0 truncate text-right text-xs text-slate-500">
          {usdValue ? usdValue : ''}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <input
          aria-describedby={error ? inputErrorId : undefined}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-slate-600 read-only:cursor-default sm:text-3xl"
          id={id}
          inputMode="decimal"
          onChange={(event) => onValueChange?.(event.target.value)}
          placeholder="0.00"
          readOnly={readOnly}
          type="text"
          value={value}
        />
        <TokenSelector
          disabled={isTokenLoading}
          isOpen={isTokenSelectorOpen}
          isLoading={isTokenLoading}
          onClick={onTokenClick}
          token={token}
        />
      </div>
      {error ? (
        <p className="mt-3 text-sm font-medium text-rose-200" id={inputErrorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
