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