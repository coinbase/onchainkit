import React from 'react';
import { formatEther, parseEther } from 'viem';
import type { Address } from 'viem';
import { publicClient } from '../network/client';
import { useOnchainActionWithCache } from '../hooks/useOnchainActionWithCache';

type BalanceProps = {
  address: Address;
  className?: string;
  decimalDigits?: number;
  props?: React.HTMLAttributes<HTMLSpanElement>;
};

const balanceAction = (address: Address) => async (): Promise<string> => {
  try {
    return await publicClient
      .getBalance({
        address,
      })
      .toString();
  } catch (err) {
    return '0';
  }
};

/**
 * Balance is a React component that renders the account balance for the given Ethereum address.
 * It displays the user's balance, with the no. of decimals specified by the 'decimalDigits' prop.
 * By default, 'decimalDigits' is set to 3.
 *
 * @param {Address} props.address - The Ethereum address for which to display the balance.
 * @param {string} [className] - Optional CSS class for custom styling.
 * @param {number} [decimalDigits=3] - Determines the no. of decimal digits to be displayed.
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props] - Additional HTML attributes for the span element.
 */
export function Balance({ address, className, decimalDigits = 3, ...props }: BalanceProps) {
  const balanceKey = `balance-${address}`;
  const { data: balance, isLoading } = useOnchainActionWithCache(
    balanceAction(address),
    balanceKey,
  );

  if (isLoading) {
    return null;
  }

  return (
    <span className={className} {...props}>
      {parseFloat(formatEther(BigInt(balance ?? '0'))).toFixed(decimalDigits)}
      {' ETH'}
    </span>
  );
}
