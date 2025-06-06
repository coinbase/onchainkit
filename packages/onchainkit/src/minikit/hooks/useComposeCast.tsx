import sdk, { ComposeCast } from '@farcaster/frame-sdk';
import { useMutation } from '@tanstack/react-query';

type ComposeCastParams<TClose extends boolean | undefined = undefined> = {
  /** Text used to prepopulate the cast body. */
  text?: string;
  /** Suggested embeds. Max two. */
  embeds?: [] | [string] | [string, string];
  /** Parent cast to reply to. */
  parent?: {
    type: 'cast';
    hash: string;
  };
  /** Whether the app should be closed after this action is called. */
  close?: TClose;
  /** Channel key to post the cast to. */
  channelKey?: string;
};

/**
 * Opens the cast composer with the suggested text and embeds.
 */
export function useComposeCast() {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async (
      params: ComposeCastParams,
    ): Promise<ComposeCast.Result> => {
      return await sdk.actions.composeCast(params);
    },
  });

  return {
    ...rest,
    composeCast: mutate,
    composeCastAsync: mutateAsync,
  };
}
