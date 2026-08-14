# Code Review: WalletPage Component
 
## Issues in the Original Code
 
### Bugs / Logic Errors
 
1. **`lhsPriority` is undefined** — used in the filter callback but never declared; should be `balancePriority`. Causes a `ReferenceError` at runtime.
2. **Inverted filter logic** — `if (balance.amount <= 0) return true` keeps balances with amount **≤ 0** (negative or zero), while the intent is clearly to keep only *positive* balances with a valid priority.
3. **`WalletBalance` is missing the `blockchain` field**, yet `balance.blockchain` is accessed throughout — a type error.
4. **Sort comparator missing `return 0`** for the equal-priority case — undefined/unstable behavior in some JS engines.
5. **`rows` maps over `sortedBalances` (type `WalletBalance`)** but the callback is typed as `FormattedWalletBalance` and accesses `balance.formatted`, which doesn't exist on the actual object — a type/runtime mismatch.
### Performance Anti-Patterns
 
6. `getPriority` uses `any` for its parameter — loses type safety; should use a string union or a `Record` lookup instead of a switch statement.
7. `getPriority` is redefined **on every render** inside the component body, even though it's a pure function with no dependency on props/state. It should live outside the component (or be wrapped in `useCallback`).
8. Inside `.sort()`, `getPriority` is called **twice per comparison** (O(n log n) calls total) instead of computing priority once per element and sorting on the cached value (decorate-sort-undecorate pattern).
9. `useMemo` depends on `prices`, but `prices` is never used in the computation — causes unnecessary recalculation of `sortedBalances` whenever `prices` changes.
10. `formattedBalances` is computed but **never used** (`rows` uses `sortedBalances` instead) — wasted computation on every render.
11. Using array **`index` as the React `key`** — a classic anti-pattern that breaks reconciliation when the list reorders or items are added/removed.
12. `prices[balance.currency]` can be `undefined` — `usdValue` becomes `NaN` with no guard against this.
13. `children` is destructured from props but never used — dead code.
---
 
## Review of the Submitted Refactor
 
Correctly fixed: the filter logic, the missing `return 0` in sort, removing `prices` from the `useMemo` deps, dropping the unused `formattedBalances`, fixing the key to `currency`, and correcting the type in `rows.map`.
 
Still off, or newly introduced:
 
1. **`React.FC<{ Props }>` is a type error.** `{ Props }` is an object type literal with a property named `Props`, not a generic parameter. Should be `React.FC<Props>`.
2. **`useWalletBalances()` and `usePrices()` were removed**, replaced with hardcoded empty array/object — the component now has no real data source. This is the most serious regression.
3. `getPriority` is still defined inside the component — issue #7 above is not fixed.
4. `getPriority` is still called twice per comparison inside `sort` — issue #8 is not fixed.
5. `className={classes.row}` is dropped from `<WalletRow />` compared to the original — lost styling.
6. `key={balance.currency}` isn't guaranteed unique if multiple blockchains share the same currency (e.g. USDC on both Ethereum and Arbitrum) — a composite key is safer.
7. `children` is still destructured but unused — not cleaned up.
8. No guard against `prices[balance.currency]` being `undefined`.
---
 
## Refactored Version
 
```tsx
import React, { useMemo } from 'react';
 
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';
 
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
 
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}
 
interface Props extends BoxProps {}
 
// Moved outside the component: it's a pure function, no need to recreate it every render
const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};
const getPriority = (blockchain: string): number => PRIORITY_MAP[blockchain] ?? -99;
 
const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();
 
  const rows = useMemo(() => {
    return balances
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain), // computed once, avoids recomputation in sort
      }))
      .sort((lhs, rhs) => rhs.priority - lhs.priority)
      .map((balance): FormattedWalletBalance => {
        const price = prices[balance.currency] ?? 0;
        return {
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue: price * balance.amount,
        };
      });
  }, [balances, prices]); // prices is now actually used, so it belongs in the deps
 
  return (
    <div {...rest}>
      {rows.map((balance) => (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
```
 