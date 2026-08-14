import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Check, Search, X } from 'lucide-react'

import type { SwapField, Token } from '../types'
import { formatTokenPrice } from '../utils/formatTokenAmount'
import { hasTokenPrice } from '../utils/hasTokenPrice'
import { TokenIcon } from './TokenIcon'

type TokenSelectModalProps = {
  field: SwapField | null
  isError?: boolean
  isLoading?: boolean
  onClose: () => void
  onRetry: () => void
  onSelect: (token: Token) => void
  open: boolean
  otherToken?: Token
  selectedToken?: Token
  tokens: Token[]
}

export function TokenSelectModal({
  field,
  isError,
  isLoading,
  onClose,
  onRetry,
  onSelect,
  open,
  otherToken,
  selectedToken,
  tokens,
}: TokenSelectModalProps) {
  const [query, setQuery] = useState('')
  const modalRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fieldLabel = field === 'from' ? 'pay' : 'receive'
  const filteredTokens = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return tokens
    }

    return tokens.filter((token) => {
      const searchableValue = `${token.symbol} ${token.name}`.toLowerCase()

      return searchableValue.includes(normalizedQuery)
    })
  }, [query, tokens])

  useEffect(() => {
    if (!open) {
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => searchInputRef.current?.focus(), 0)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setQuery('')
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (!firstElement || !lastElement) {
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  function handleClose() {
    setQuery('')
    onClose()
  }

  function handleSelect(token: Token) {
    if (!hasTokenPrice(token)) {
      return
    }

    onSelect(token)
    handleClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
    >
      <section
        ref={modalRef}
        aria-labelledby="token-select-title"
        aria-describedby="token-select-description"
        aria-modal="true"
        className="max-h-[88svh] w-full max-w-md animate-[swap-sheet-in_240ms_ease-out] overflow-hidden rounded-t-[8px] border border-white/10 bg-[#111620] shadow-2xl shadow-black/60 sm:rounded-[8px]"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <h2
              className="text-base font-semibold text-white"
              id="token-select-title"
            >
              Select token to {fieldLabel}
            </h2>
            <p className="text-sm text-slate-500" id="token-select-description">
              {tokens.filter(hasTokenPrice).length} supported assets
            </p>
          </div>
          <button
            aria-label="Close token selector"
            className="grid size-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
            onClick={handleClose}
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="border-b border-white/10 p-4">
          <div className="flex h-11 items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 text-slate-400 focus-within:border-cyan-300/50">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search symbol or name"
              ref={searchInputRef}
              type="search"
              value={query}
            />
          </div>
        </div>

        <div
          aria-label="Token options"
          className="max-h-[52svh] overflow-y-auto p-2"
          role="listbox"
        >
          {isLoading ? (
            <div aria-live="polite" className="space-y-2 p-1" role="status">
              <TokenRowSkeleton />
              <TokenRowSkeleton />
              <TokenRowSkeleton />
              <TokenRowSkeleton />
            </div>
          ) : null}

          {isError ? (
            <div
              aria-live="polite"
              className="space-y-3 px-3 py-8 text-center"
              role="status"
            >
              <AlertCircle
                className="mx-auto size-6 text-rose-200"
                aria-hidden="true"
              />
              <p className="text-sm text-rose-100">Unable to load prices.</p>
              <button
                className="rounded-[8px] border border-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                onClick={onRetry}
                type="button"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !isError && filteredTokens.length === 0 ? (
            <div
              aria-live="polite"
              className="px-3 py-8 text-center text-sm text-slate-400"
              role="status"
            >
              No tokens found.
            </div>
          ) : null}

          {!isLoading && !isError
            ? filteredTokens.map((token) => {
                const isSelected = selectedToken?.symbol === token.symbol
                const isOtherSideToken = otherToken?.symbol === token.symbol
                const isSupported = hasTokenPrice(token)

                return (
                  <button
                    aria-disabled={!isSupported}
                    aria-selected={isSelected}
                    className={[
                      'mb-1 flex w-full items-center gap-3 rounded-[8px] border px-3 py-3 text-left transition',
                      isSelected
                        ? 'border-cyan-300/50 bg-cyan-300/10'
                        : 'border-transparent hover:border-white/10 hover:bg-white/[0.05]',
                      !isSupported
                        ? 'cursor-not-allowed opacity-45'
                        : 'cursor-pointer',
                    ].join(' ')}
                    disabled={!isSupported}
                    key={token.symbol}
                    onClick={() => handleSelect(token)}
                    role="option"
                    type="button"
                  >
                    <TokenIcon size="md" token={token} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-white">
                          {token.symbol}
                        </span>
                        {isOtherSideToken ? (
                          <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-2 py-0.5 text-[11px] font-medium text-amber-100">
                            Other side
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-slate-500">
                        {token.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-medium text-slate-200">
                        {isSupported
                          ? formatTokenPrice(token.price)
                          : 'No price'}
                      </span>
                      {isSelected ? (
                        <Check
                          className="ml-auto mt-1 size-4 text-cyan-200"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </button>
                )
              })
            : null}
        </div>
      </section>
    </div>
  )
}

function TokenRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-[8px] px-3 py-3">
      <div className="size-9 shrink-0 animate-pulse rounded-full bg-white/10" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.06]" />
      </div>
      <div className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
    </div>
  )
}
