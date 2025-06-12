import sdk from '@farcaster/frame-sdk';
import { useMutation } from '@tanstack/react-query';

/**
 * Adds a frame to the user's farcaster account, enabling notifications.
 * @returns The notification details of the frame added or null if the frame was not added successfully.
 */
export function useAddFrame() {
  const {
    mutate: addFrame,
    mutateAsync: addFrameAsync,
    ...rest
  } = useMutation({
    mutationFn: async () => {
      const result = await sdk.actions.addFrame();
      return result.notificationDetails;
    },
  });

  return {
    addFrame,
    addFrameAsync,
    ...rest,
  };
}
