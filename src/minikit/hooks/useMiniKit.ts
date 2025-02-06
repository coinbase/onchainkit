import { useContext, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { MiniKitContext } from "@/minikit/MiniKitProvider";

export const useMiniKit = () => {
  const [isReady, setIsReady] = useState(false);
  const context = useContext(MiniKitContext);
  if (!context) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }

  const ready = async () => {
    sdk.actions.ready({});
    setIsReady(true);
    return context;
  };

  return {
    ready,
    isReady,
    context: context.context,
    updateClientContext: context.updateClientContext,
    notificationProxyUrl: context.notificationProxyUrl,
  };
};
