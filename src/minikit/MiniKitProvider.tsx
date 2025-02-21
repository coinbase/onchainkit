'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import sdk from "@farcaster/frame-sdk";
import type { Context, FrameNotificationDetails } from "@farcaster/frame-sdk";
import { OnchainKitProvider } from '@/OnchainKitProvider';
import type { OnchainKitProviderReact } from '@/types';
import { coinbaseWallet } from 'wagmi/connectors';
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { DefaultOnchainKitProviders } from '@/DefaultOnchainKitProviders';

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
  ...onchainKitProps
}: MiniKitProviderReact & OnchainKitProviderReact) {
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
      // if not running in a frame, context resolves as undefined
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

  const connectors = useMemo(() => {
    return [context // if context is set, the app is running in a frame, use farcasterFrame connector
      ? farcasterFrame() 
      : coinbaseWallet({
        appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
        appLogoUrl: process.env.NEXT_PUBLIC_ICON_URL,
        preference: 'all',
      })]
  }, [context]);

  const value = useMemo(() => {
    return {
      context,
      updateClientContext,
      notificationProxyUrl,
    };
  }, [updateClientContext, notificationProxyUrl, context]);

  return (
    <MiniKitContext.Provider value={value}>
      <DefaultOnchainKitProviders
        apiKey={onchainKitProps.apiKey}
        appName={onchainKitProps.config?.appearance?.name ?? undefined}
        appLogoUrl={onchainKitProps.config?.appearance?.logo ?? undefined}
        connectors={connectors}
      >
        <OnchainKitProvider {...onchainKitProps}>
          <div style={{ 
            paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
            paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
            paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
            paddingRight: context?.client.safeAreaInsets?.right ?? 0 ,
          }}>
            {children}
          </div>
        </OnchainKitProvider>
      </DefaultOnchainKitProviders>
    </MiniKitContext.Provider>
  );
}

