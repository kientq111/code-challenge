import { ChevronDown, Loader2 } from 'lucide-react'

import type { Token } from '../types'
import { TokenIcon } from './TokenIcon'

type TokenSelectorProps = {
  disabled?: boolean
  isOpen?: boolean
  isLoading?: boolean
  onClick: () => void
  token?: Token
}

export function TokenSelector({
  disabled,
  isOpen,
  isLoading,
  onClick,
  token,
}: TokenSelectorProps) {
  return (
    <button
      aria-label={
        token ? `Select token, current ${token.symbol}` : 'Select token'
      }
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className="flex h-11 shrink-0 items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.06] px-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-cyan-300/40 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-cyan-200" />
      ) : (
        <TokenIcon size="sm" token={token} />
      )}
      <span className="max-w-[6.5rem] truncate">
        {token?.symbol ?? 'Token'}
      </span>
      <ChevronDown className="size-4 text-slate-400" aria-hidden="true" />
    </button>
  )
}
