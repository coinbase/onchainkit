import { toReadableAmount } from '@/swap/utils/toReadableAmount';
import type { Token } from '@/token/types';
import { getBalance } from '@wagmi/core';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { erc20Abi } from 'viem';
import { useConfig } from 'wagmi';
import { readContract } from 'wagmi/actions';

interface UseBalanceProps {
  address?: Address;
  token: Token;
  chainId: number;
}

export const useBalance = ({ address, token, chainId }: UseBalanceProps) => {
  const [balance, setBalance] = useState<string>('');
  const wagmiConfig = useConfig();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        return;
      }

      let _balance: string;
      if (token.address) {
        const erc20Balance = await readContract(wagmiConfig, {
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
          address: token.address as Address,
          chainId,
        });
        _balance = toReadableAmount(erc20Balance.toString(), token.decimals);
      } else {
        const ethBalance = await getBalance(wagmiConfig, {
          address,
          chainId,
        });
        _balance = toReadableAmount(
          ethBalance.value.toString(),
          ethBalance.decimals,
        );
      }

      setBalance(_balance);
    };

    fetchBalance();
  }, [address, token, chainId, wagmiConfig]);

  return balance;
};
