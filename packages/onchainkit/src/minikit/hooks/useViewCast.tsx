import sdk from '@farcaster/frame-sdk';
import { useMutation } from '@tanstack/react-query';

type ViewCastParams = {
  /** The hash of the cast to view. */
  hash: string;
  /** Whether the app should be closed after this action is called. */
  close?: boolean;
};

/**
 * Open a cast by its hash in the current client.
 */
export function useViewCast() {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async (params: ViewCastParams) => {
      return await sdk.actions.viewCast(params);
    },
  });

  return {
    ...rest,
    viewCast: mutate,
    viewCastAsync: mutateAsync,
  };
}
