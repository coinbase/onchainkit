import sdk, { type SetPrimaryButtonOptions } from '@farcaster/frame-sdk';
import { useEffect } from 'react';

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
