import sdk, { type SetPrimaryButtonOptions } from '@farcaster/frame-sdk';
import { useEffect } from 'react';

/**
 * Sets the primary button for the frame and adds the callback to be called when the primary button is clicked.
 * @param options - The options for the primary button.
 * @param callback - The callback to be called when the primary button is clicked.
 * @returns void
 */
export function usePrimaryButton(
  options: SetPrimaryButtonOptions,
  callback: () => void,
): void {
  useEffect(() => {
    async function setPrimaryButton() {
      await sdk.actions.setPrimaryButton(options);
    }

    sdk.on('primaryButtonClicked', callback);
    setPrimaryButton();
  }, [callback, options]);
}
