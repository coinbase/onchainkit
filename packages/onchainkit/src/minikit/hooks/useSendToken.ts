import sdk from '@farcaster/frame-sdk';
import { useMutation } from '@tanstack/react-query';

type SendTokenParams = {
  /**
   * Token to send, formatted as a CAIP-19 asset ID.
   * @example
   * ```
   * // Base USDC
   * "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
   * ```
   */
  token?: string;
  /**
   * Amount to send, formatted as a numeric string including decimals.
   * @example
   * ```
   * // 10 USDC
   * "1000000"
   * ```
   */
  amount?: string;
  /**
   * Recipient wallet address
   */
  recipientAddress?: string;
  /**
   * Recipient FID
   */
  recipientFid?: number;
};

type SendTokenReturnOriginal = ReturnType<
  typeof useMutation<
    Awaited<ReturnType<typeof sdk.actions.sendToken>>,
    Error,
    SendTokenParams
  >
>;

type SendTokenReturn = Omit<
  SendTokenReturnOriginal,
  'mutate' | 'mutateAsync'
> & {
  sendToken: SendTokenReturnOriginal['mutate'];
  sendTokenAsync: SendTokenReturnOriginal['mutateAsync'];
};

/**
 * Opens the send token form with the parameters pre-filled. The user will be able to modify the details before submitting the transaction.
 */
export function useSendToken(): SendTokenReturn {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async (params: SendTokenParams) => {
      return await sdk.actions.sendToken(params);
    },
  });

  return {
    ...rest,
    sendToken: mutate,
    sendTokenAsync: mutateAsync,
  };
}
