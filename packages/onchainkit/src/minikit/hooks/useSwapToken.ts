import sdk from '@farcaster/frame-sdk';
import { useMutation } from '@tanstack/react-query';

type SwapTokenParams = {
  /**
   * Token to sell, formatted as a CAIP-19 asset ID.
   * @example
   * ```
   * // Base USDC
   * "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
   * ```
   */
  sellToken?: string;
  /**
   * Token to buy, formatted as a CAIP-19 asset ID.
   * @example
   * ```
   * // OP ETH
   * "eip155:10/native"
   * ```
   */
  buyToken?: string;
  /**
   * Amount to sell, formatted as a numeric string including decimals.
   * @example
   * ```
   * // 1 USDC (1_000_000)
   * "1000000"
   * ```
   */
  sellAmount?: string;
};

type SwapTokenReturnOriginal = ReturnType<
  typeof useMutation<
    Awaited<ReturnType<typeof sdk.actions.swapToken>>,
    Error,
    SwapTokenParams
  >
>;

type SwapTokenReturn = Omit<
  SwapTokenReturnOriginal,
  'mutate' | 'mutateAsync'
> & {
  swapToken: SwapTokenReturnOriginal['mutate'];
  swapTokenAsync: SwapTokenReturnOriginal['mutateAsync'];
};

/**
 * Opens the swap form with the tokens pre-selected. The user will be able to modify the swap before submitting the transaction.
 */
export function useSwapToken(): SwapTokenReturn {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async (params: SwapTokenParams) => {
      return await sdk.actions.swapToken(params);
    },
  });

  return {
    ...rest,
    swapToken: mutate,
    swapTokenAsync: mutateAsync,
  };
}
