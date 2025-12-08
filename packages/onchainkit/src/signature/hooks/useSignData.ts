import { useCallback, useMemo } from 'react';
import { useSignMessage, useSignTypedData } from 'wagmi';
import { MessageData, Message } from '../types';
import { validateMessage } from '../utils/validateMessage';

export function useSignData() {
  const { signTypedDataAsync, reset: resetSignTypedData } = useSignTypedData();
  const { signMessageAsync, reset: resetSignMessage } = useSignMessage();

  const signData = useCallback(
    async ({ domain, types, message, primaryType }: MessageData) => {
      const { type, data } = validateMessage({
        domain,
        types,
        message,
        primaryType,
      });

      if (type === Message.INVALID) {
        throw new Error('Invalid message data');
      }

      const signature =
        type === Message.TYPED_DATA
          ? await signTypedDataAsync(data)
          : await signMessageAsync(data);

      return signature;
    },
    [signTypedDataAsync, signMessageAsync],
  );

  return useMemo(() => {
    return {
      signData,
      resetSignData: () => {
        resetSignMessage();
        resetSignTypedData();
      },
    };
  }, [signData, resetSignMessage, resetSignTypedData]);
}
