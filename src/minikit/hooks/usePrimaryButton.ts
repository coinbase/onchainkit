import { useEffect } from "react";
import sdk, { type SetPrimaryButtonOptions } from "@farcaster/frame-sdk";

export function usePrimaryButton(options: SetPrimaryButtonOptions, callback: () => void):void {
  useEffect(() => {
    async function setPrimaryButton() {
      await sdk.actions.setPrimaryButton(options);
    }

    sdk.on('primaryButtonClicked', callback);
    setPrimaryButton();
  }, [callback, options])
}