import { useCallback, useState } from 'react';
import { useWriteContract } from 'wagmi';
import { erc20Abi, type Address } from 'viem';

export type RevokeAllowanceParams = {
  token: Address;
  spender: Address;
};

export function useRevokeAllowance() {
  const { writeContractAsync, isPending: isRevoking } = useWriteContract();

  const revoke = useCallback(async ({ token, spender }: RevokeAllowanceParams) => {
    await writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, 0n], // approve 0 = revoke
    });
  }, [writeContractAsync]);

  return {
    revoke,
    isRevoking,
  };
}
