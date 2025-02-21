import sdk from "@farcaster/frame-sdk";
import { useMiniKit } from "./useMiniKit";
import { useCallback } from "react";

export function useAddFrame() {
  const { updateClientContext } = useMiniKit();

  return useCallback(async () => {
    const result = await sdk.actions.addFrame();

    if (result.notificationDetails) {
      updateClientContext({
        details: result.notificationDetails,
        frameAdded: true,
      });
      return result.notificationDetails;
    }
    return null;
  }, [updateClientContext]);
}
