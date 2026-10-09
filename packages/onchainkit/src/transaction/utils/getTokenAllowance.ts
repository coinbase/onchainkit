import { type Address, erc20Abi } from 'viem';
import { readContract } from '@wagmi/core';
import type { APIError } from '@/api/types';
import { buildErrorStruct } from '@/api/utils/buildErrorStruct';
import { ApiErrorCode } from '@/api/constants';

export type TokenAllowance = {
  token: Address;
  tokenName?: string;
  tokenSymbol?: string;
  spender: Address;
  amount: string;
  isInfinite: boolean;
};

export type GetTokenAllowanceParams = {
  owner: Address;
  token: Address;
  spender: Address;
  chainId?: number;
};

export async function getTokenAllowance({
  owner,
  token,
  spender,
  chainId,
}: GetTokenAllowanceParams): Promise<TokenAllowance | APIError> {
  try {
    const amount = await readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [owner, spender],
      chainId,
    });

    const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    const isInfinite = amount.toString() === MAX_UINT256;

    return {
      token,
      spender,
      amount: amount.toString(),
      isInfinite,
    };
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa02,
      error: JSON.stringify(error),
      message: `Failed to read allowance for ${token}`,
    });
  }
}
