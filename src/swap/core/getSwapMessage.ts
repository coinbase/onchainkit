import type { GetSwapMessageParams } from '../types';

export enum SwapMessage {
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  LOW_LIQUIDITY = 'Liquidity too low for the token"',
}

const LOW_LIQUIDITY_ERROR_CODE = -32602;

export function getSwapMessage({
  error,
  fromAmount,
  fromToken,
  fromTokenBalance,
  toAmount,
  toToken,
}: GetSwapMessageParams) {
  // amount exceeds balance
  if (Number(fromTokenBalance) < Number(fromAmount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }

  // low liquidity
  if (error?.code === LOW_LIQUIDITY_ERROR_CODE) {
    return SwapMessage.LOW_LIQUIDITY;
  }

  // missing required fields
  if (!fromAmount || !fromToken || !toAmount || !toToken) {
    return SwapMessage.INCOMPLETE_FIELD;
  }

  // TODO: handle loading
  // TODO: handle swap quote error
  // TODO: handle balance error

  if (error) {
    return error.error;
  }
}
