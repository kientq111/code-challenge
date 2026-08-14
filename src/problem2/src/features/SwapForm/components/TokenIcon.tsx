import { useState } from 'react'

import type { Token } from '../types'

const TOKEN_ICON_PALETTE = [
  ['#67e8f9', '#155e75'],
  ['#a7f3d0', '#166534'],
  ['#fde68a', '#92400e'],
  ['#fda4af', '#9f1239'],
  ['#c4b5fd', '#5b21b6'],
  ['#f0abfc', '#86198f'],
  ['#93c5fd', '#1d4ed8'],
  ['#fed7aa', '#9a3412'],
]

type TokenIconProps = {
  size?: 'sm' | 'md' | 'lg'
  token?: Token
}

export function TokenIcon({ size = 'md', token }: TokenIconProps) {
  const [failedIconUrl, setFailedIconUrl] = useState<string | null>(null)

  const sizeClassName = {
    lg: 'size-11 text-sm',
    md: 'size-9 text-xs',
    sm: 'size-7 text-[10px]',
  }[size]
  const palette = TOKEN_ICON_PALETTE[getPaletteIndex(token?.symbol ?? '')]
  const initials = getTokenInitials(token?.symbol)
  const shouldShowImage = token?.icon && failedIconUrl !== token.icon

  return (
    <span
      className={`grid ${sizeClassName} shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 font-bold text-white shadow-sm`}
      style={{
        background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
      }}
    >
      {shouldShowImage ? (
        <img
          alt=""
          className="h-full w-full rounded-full object-cover"
          onError={() => setFailedIconUrl(token.icon ?? null)}
          src={token.icon}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  )
}

function getTokenInitials(symbol?: string) {
  if (!symbol) {
    return '?'
  }

  return symbol
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 3)
    .toUpperCase()
}

function getPaletteIndex(symbol: string) {
  const hash = Array.from(symbol).reduce(
    (value, character) => value + character.charCodeAt(0),
    0,
  )

  return hash % TOKEN_ICON_PALETTE.length
}
