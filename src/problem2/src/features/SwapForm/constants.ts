import type { Token } from './types'

export const TOKEN_PRICE_API_URL = 'https://interview.switcheo.com/prices.json'
export const TOKEN_ICON_BASE_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'

export const DEFAULT_FROM_SYMBOL = 'ETH'
export const DEFAULT_TO_SYMBOL = 'USDC'

export const FEATURED_TOKEN_SYMBOLS = [
  'ETH',
  'USDC',
  'WBTC',
  'ATOM',
  'OSMO',
  'SWTH',
  'BUSD',
  'USD',
]

export const TOKEN_NAME_BY_SYMBOL: Record<string, string> = {
  ATOM: 'Cosmos Hub',
  BLUR: 'Blur',
  BUSD: 'Binance USD',
  ETH: 'Ethereum',
  EVMOS: 'Evmos',
  GMX: 'GMX',
  IBCX: 'IBC Index',
  IRIS: 'IRISnet',
  KUJI: 'Kujira',
  LSI: 'Liquid Staking Index',
  LUNA: 'Terra',
  OKB: 'OKB',
  OKT: 'OKT Chain',
  OSMO: 'Osmosis',
  RATOM: 'Rocket Atom',
  STATOM: 'Stride Staked ATOM',
  STEVMOS: 'Stride Staked Evmos',
  STLUNA: 'Stride Staked LUNA',
  STOSMO: 'Stride Staked OSMO',
  STRD: 'Stride',
  SWTH: 'Carbon',
  USC: 'USC',
  USD: 'US Dollar',
  USDC: 'USD Coin',
  WBTC: 'Wrapped Bitcoin',
  YieldUSD: 'Yield USD',
  ZIL: 'Zilliqa',
  ampLUNA: 'Amplified LUNA',
  axlUSDC: 'Axelar USDC',
  bNEO: 'Burger NEO',
  rSWTH: 'Reward SWTH',
  wstETH: 'Wrapped Staked ETH',
}

export const INITIAL_TOKENS: Token[] = [
  {
    symbol: DEFAULT_FROM_SYMBOL,
    name: 'Ethereum',
  },
  {
    symbol: DEFAULT_TO_SYMBOL,
    name: 'USD Coin',
  },
]
