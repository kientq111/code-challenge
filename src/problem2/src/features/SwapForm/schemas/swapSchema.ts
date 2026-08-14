import { z } from 'zod'

import {
  MAX_SWAP_DECIMALS,
  countSwapAmountDecimals,
  isSafeSwapAmount,
  isValidSwapAmount,
} from '../utils/amount'

export const swapSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Enter an amount')
    .refine(isValidSwapAmount, 'Enter a valid amount')
    .refine((amount) => Number(amount) > 0, 'Amount must be greater than 0')
    .refine(
      (amount) => countSwapAmountDecimals(amount) <= MAX_SWAP_DECIMALS,
      `Use ${MAX_SWAP_DECIMALS} decimals or fewer`,
    )
    .refine(isSafeSwapAmount, 'Amount is too large to quote safely'),
})

export type SwapFormValues = z.infer<typeof swapSchema>
