import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { DEFAULT_FROM_SYMBOL, DEFAULT_TO_SYMBOL } from '../constants'
import { swapSchema, type SwapFormValues } from '../schemas/swapSchema'
import type { SwapField, SwapQuote, Token } from '../types'
import { normalizeSwapAmountInput, parseSwapAmount } from '../utils/amount'
import { calculateSwapQuote } from '../utils/calculateSwapQuote'
import { formatTokenAmount } from '../utils/formatTokenAmount'
import { hasTokenPrice } from '../utils/hasTokenPrice'
import { useTokenPrices } from './useTokenPrices'

export function useSwap() {
  const tokenPricesQuery = useTokenPrices()
  const [fromSymbol, setFromSymbol] = useState(DEFAULT_FROM_SYMBOL)
  const [toSymbol, setToSymbol] = useState(DEFAULT_TO_SYMBOL)
  const [reviewSnapshot, setReviewSnapshot] = useState<{
    key: string
    message: string
  } | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)

  const form = useForm<SwapFormValues>({
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
    resolver: zodResolver(swapSchema),
  })

  const amount =
    useWatch({
      control: form.control,
      name: 'amount',
    }) ?? ''
  const amountValue = parseSwapAmount(amount)
  const tokens = useMemo(
    () => tokenPricesQuery.data ?? [],
    [tokenPricesQuery.data],
  )

  const fromToken = useMemo(
    () =>
      findTokenBySymbol(tokens, fromSymbol) ??
      findTokenBySymbol(tokens, DEFAULT_FROM_SYMBOL) ??
      tokens[0],
    [fromSymbol, tokens],
  )
  const toToken = useMemo(
    () =>
      findTokenBySymbol(tokens, toSymbol) ??
      findTokenBySymbol(tokens, DEFAULT_TO_SYMBOL) ??
      tokens.find((token) => token.symbol !== fromToken?.symbol) ??
      tokens[0],
    [fromToken?.symbol, toSymbol, tokens],
  )
  const quoteKey = useMemo(
    () =>
      [
        amount,
        fromToken?.symbol ?? '',
        toToken?.symbol ?? '',
        fromToken?.price ?? '',
        toToken?.price ?? '',
      ].join('|'),
    [amount, fromToken, toToken],
  )
  const quote = useMemo(
    () =>
      calculateSwapQuote({
        amount: amountValue,
        fromToken,
        toToken,
      }),
    [amountValue, fromToken, toToken],
  )
  const supportedTokens = useMemo(() => tokens.filter(hasTokenPrice), [tokens])

  const amountError =
    form.formState.touchedFields.amount || form.formState.isSubmitted
      ? form.formState.errors.amount?.message
      : undefined
  const swapError = getSwapError({
    amountValue,
    fromToken,
    hasTokenData: tokens.length > 0,
    isApiUnavailable: tokenPricesQuery.isError && tokens.length === 0,
    isTokenListLoaded: tokenPricesQuery.isSuccess,
    quote,
    supportedTokenCount: supportedTokens.length,
    toToken,
  })
  const visibleError = amountError ?? swapError
  const canReview = Boolean(
    amountValue &&
    quote &&
    !form.formState.errors.amount &&
    !swapError &&
    !tokenPricesQuery.isFetching &&
    !isReviewing,
  )
  const reviewMessage =
    reviewSnapshot?.key === quoteKey ? reviewSnapshot.message : null

  function setAmount(nextAmount: string) {
    form.setValue('amount', normalizeSwapAmountInput(nextAmount), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  function selectToken(field: SwapField, token: Token) {
    if (field === 'from') {
      setFromSymbol(token.symbol)
      return
    }

    setToSymbol(token.symbol)
  }

  function reverseTokens() {
    setFromSymbol(toToken?.symbol ?? toSymbol)
    setToSymbol(fromToken?.symbol ?? fromSymbol)
  }

  function retryTokenPrices() {
    void tokenPricesQuery.refetch()
  }

  const reviewSwap = form.handleSubmit(async () => {
    if (!canReview || !amountValue || !quote || !fromToken || !toToken) {
      return
    }

    setIsReviewing(true)
    setReviewSnapshot(null)

    await delay(2000)

    setReviewSnapshot({
      key: quoteKey,
      message: `${formatTokenAmount(amountValue)} ${
        fromToken.symbol
      } -> ${formatTokenAmount(quote.outputAmount)} ${toToken.symbol}`,
    })
    setIsReviewing(false)
  })

  return {
    amount,
    amountError,
    amountValue,
    canReview,
    exchangeRate: quote?.exchangeRate ?? null,
    form,
    fromToken,
    inputValueUsd: quote?.inputValueUsd ?? null,
    inverseExchangeRate: quote?.inverseExchangeRate ?? null,
    isReviewing,
    outputAmount: quote?.outputAmount ?? null,
    outputValueUsd: quote?.outputValueUsd ?? null,
    priceValueDeltaPercent: quote?.valueDeltaPercent ?? null,
    quote,
    retryTokenPrices,
    reviewMessage,
    reviewSwap,
    reverseTokens,
    selectToken,
    setAmount,
    swapError,
    supportedTokens,
    tokens,
    toToken,
    tokenPricesQuery,
    visibleError,
  }
}

function findTokenBySymbol(tokens: Token[], symbol: string) {
  return tokens.find((token) => token.symbol === symbol)
}

function delay(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

function getSwapError({
  amountValue,
  fromToken,
  hasTokenData,
  isApiUnavailable,
  isTokenListLoaded,
  quote,
  supportedTokenCount,
  toToken,
}: {
  amountValue: number | null
  fromToken?: Token
  hasTokenData: boolean
  isApiUnavailable: boolean
  isTokenListLoaded: boolean
  quote: SwapQuote | null
  supportedTokenCount: number
  toToken?: Token
}) {
  if (isApiUnavailable) {
    return 'Price API is unavailable. Try again.'
  }

  if (!isTokenListLoaded && !hasTokenData) {
    return undefined
  }

  if (supportedTokenCount < 2) {
    return 'Not enough supported tokens to quote a swap.'
  }

  if (!fromToken || !toToken) {
    return 'Select both tokens.'
  }

  if (fromToken.symbol === toToken.symbol) {
    return 'Choose two different tokens.'
  }

  if (!hasTokenPrice(fromToken)) {
    return `${fromToken.symbol} does not have a supported price.`
  }

  if (!hasTokenPrice(toToken)) {
    return `${toToken.symbol} does not have a supported price.`
  }

  if (amountValue && !quote) {
    return 'Unable to calculate a safe quote for this amount.'
  }

  return undefined
}
