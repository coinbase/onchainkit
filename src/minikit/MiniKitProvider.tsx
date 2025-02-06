'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import sdk from "@farcaster/frame-sdk";
import type { Context, FrameNotificationDetails } from "@farcaster/frame-sdk";

type UpdateClientContextParams = {
  details?: FrameNotificationDetails | null;
  frameAdded?: boolean;
};

type MiniKitContextType = {
  context: Context.FrameContext | null;
  updateClientContext: (params: UpdateClientContextParams) => void;
  notificationProxyUrl: string;
};

const EMPTY_CONTEXT:MiniKitContextType = {
  context: null,
  updateClientContext: () => {},
  notificationProxyUrl: '',
};

export const MiniKitContext =
  createContext<MiniKitContextType>(EMPTY_CONTEXT);

export type MiniKitProviderReact = {
  children: React.ReactNode;
  notificationProxyUrl?: string;
};

/**
 * Provides the MiniKit React Context to the app.
 */
export function MiniKitProvider({
  children,
  notificationProxyUrl = '/api/notify',
}: MiniKitProviderReact) {
  const [context, setContext] = useState<Context.FrameContext | null>(null);
  
  useEffect(() => {
    sdk.on("frameAdded", ({notificationDetails}) => {
      if (notificationDetails) {
        updateClientContext({
          details: notificationDetails,
          frameAdded: true,
        });
      }
    });

    sdk.on("frameAddRejected", ({reason}) => {
      console.error('Frame add rejected', reason);
    });

    sdk.on("frameRemoved", () => {
      updateClientContext({
        details: null,
        frameAdded: false,
      });
    });

    sdk.on("notificationsEnabled", ({notificationDetails}) => {
      updateClientContext({
        details: notificationDetails,
      });
    });

    sdk.on("notificationsDisabled", () => {
      updateClientContext({
        details: null,
      });
    });

    async function fetchContext() {
      const context = await sdk.context;
      setContext(context);
    }

    fetchContext();

    return () => {
      sdk.removeAllListeners();
    }
  }, []);

  const updateClientContext = useCallback(({ details, frameAdded }: UpdateClientContextParams) => {
    setContext((prevContext) => {
      if (!prevContext) {
        return null;
      }
      return {
        ...prevContext,
        client: {
          ...prevContext.client,
          notificationDetails: details ?? prevContext.client.notificationDetails,
          added: frameAdded ?? prevContext.client.added,
        }
      }
    })
  }, []);

  const value = useMemo(() => {
    return {
      context,
      updateClientContext,
      notificationProxyUrl,
    };
  }, [updateClientContext, notificationProxyUrl, context]);

  console.log('context', context);

  return (
    <MiniKitContext.Provider value={value}>
      <div style={{ 
        paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0 ,
      }}>
        {children}
      </div>
    </MiniKitContext.Provider>
  );
}

