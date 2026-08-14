import { useState } from 'react'
import { RefreshCcw, WifiOff } from 'lucide-react'

import type { SwapField } from './types'
import { formatTokenAmount, formatUsdValue } from './utils/formatTokenAmount'
import { useSwap } from './hooks/useSwap'
import { ExchangeRate } from './components/ExchangeRate'
import { SwapDirectionButton } from './components/SwapDirectionButton'
import { SwapInput } from './components/SwapInput'
import { SwapSummary } from './components/SwapSummary'
import { TokenSelectModal } from './components/TokenSelectModal'

export function SwapForm() {
  const [activeSelector, setActiveSelector] = useState<SwapField | null>(null)
  const swap = useSwap()
  const isPriceLoading = swap.tokenPricesQuery.isLoading
  const isPriceRefreshing = swap.tokenPricesQuery.isFetching && !isPriceLoading
  const isUsingCachedData =
    swap.tokenPricesQuery.isError && swap.tokens.length > 0
  const activeSelectedToken =
    activeSelector === 'from' ? swap.fromToken : swap.toToken
  const otherSelectedToken =
    activeSelector === 'from' ? swap.toToken : swap.fromToken

  return (
    <section className="w-full max-w-[28rem]">
      <form
        aria-busy={isPriceLoading}
        aria-describedby="swap-live-status"
        className="relative animate-[swap-fade-up_280ms_ease-out] overflow-hidden rounded-[8px] border border-white/10 bg-[#151a23]/95 p-4 shadow-2xl shadow-black/50"
        noValidate
        onSubmit={swap.reviewSwap}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-amber-200/0" />

        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-white">Currency swap</h1>
            <p
              aria-live="polite"
              className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"
              id="swap-live-status"
              role="status"
            >
              {isUsingCachedData ? (
                <>
                  <WifiOff className="size-3.5" aria-hidden="true" />
                  Showing cached prices
                </>
              ) : isPriceLoading ? (
                'Loading market prices'
              ) : isPriceRefreshing ? (
                'Refreshing market prices'
              ) : (
                `${swap.supportedTokens.length} assets ready`
              )}
            </p>
          </div>
          <button
            aria-label="Refresh token prices"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPriceLoading}
            onClick={swap.retryTokenPrices}
            type="button"
          >
            <RefreshCcw
              className={[
                'size-4',
                isPriceRefreshing ? 'animate-spin text-cyan-200' : '',
              ].join(' ')}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className="space-y-1">
          <SwapInput
            error={swap.amountError}
            id="swap-from-amount"
            isTokenLoading={isPriceLoading}
            isTokenSelectorOpen={activeSelector === 'from'}
            label="You pay"
            onTokenClick={() => setActiveSelector('from')}
            onValueChange={swap.setAmount}
            token={swap.fromToken}
            usdValue={formatUsdValue(swap.inputValueUsd)}
            value={swap.amount}
          />
          <SwapDirectionButton
            disabled={!swap.fromToken || !swap.toToken}
            onClick={swap.reverseTokens}
          />
          <SwapInput
            id="swap-to-amount"
            isTokenLoading={isPriceLoading}
            isTokenSelectorOpen={activeSelector === 'to'}
            label="You receive"
            onTokenClick={() => setActiveSelector('to')}
            readOnly
            token={swap.toToken}
            value={
              swap.outputAmount ? formatTokenAmount(swap.outputAmount, 8) : ''
            }
          />
        </div>

        <ExchangeRate
          exchangeRate={swap.exchangeRate}
          fromToken={swap.fromToken}
          inverseExchangeRate={swap.inverseExchangeRate}
          isLoading={isPriceLoading || isPriceRefreshing}
          toToken={swap.toToken}
        />
        <SwapSummary
          canReview={swap.canReview}
          errorMessage={swap.visibleError}
          fromToken={swap.fromToken}
          inputAmount={swap.amountValue}
          isLoading={isPriceLoading || swap.isReviewing}
          outputAmount={swap.outputAmount}
          reviewMessage={swap.reviewMessage}
          toToken={swap.toToken}
        />
      </form>

      <TokenSelectModal
        field={activeSelector}
        isError={swap.tokenPricesQuery.isError}
        isLoading={isPriceLoading}
        onClose={() => setActiveSelector(null)}
        onRetry={swap.retryTokenPrices}
        onSelect={(token) => {
          if (!activeSelector) {
            return
          }

          swap.selectToken(activeSelector, token)
        }}
        open={Boolean(activeSelector)}
        otherToken={otherSelectedToken}
        selectedToken={activeSelectedToken}
        tokens={swap.tokens}
      />
    </section>
  )
}
