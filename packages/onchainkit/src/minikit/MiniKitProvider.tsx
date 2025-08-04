'use client';
import { DefaultOnchainKitProviders } from '@/DefaultOnchainKitProviders';
import { OnchainKitProvider } from '@/OnchainKitProvider';
import type { OnchainKitProviderReact } from '@/types';
import sdk, { type Context } from '@farcaster/frame-sdk';
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { coinbaseWallet } from 'wagmi/connectors';
import type {
  MiniKitContextType,
  MiniKitProviderReact,
  UpdateClientContextParams,
} from './types';
import { AutoConnect } from './components/AutoConnect';

export const emptyContext = {} as MiniKitContextType;

export const MiniKitContext = createContext<MiniKitContextType>(emptyContext);

/**
 * Provides the MiniKit React Context to the app.
 */
export function MiniKitProvider({
  children,
  notificationProxyUrl = '/api/notify',
  autoConnect = true,
  ...onchainKitProps
}: MiniKitProviderReact & OnchainKitProviderReact) {
  const [context, setContext] = useState<Context.MiniAppContext | null>(null);

  useEffect(() => {
    sdk.on('miniAppAdded', ({ notificationDetails }) => {
      if (notificationDetails) {
        updateClientContext({
          details: notificationDetails,
          frameAdded: true,
        });
      }
    });

    sdk.on('miniAppAddRejected', ({ reason }) => {
      console.error('Mini app add rejected', reason);
    });

    sdk.on('miniAppRemoved', () => {
      updateClientContext({
        details: undefined,
        frameAdded: false,
      });
    });

    sdk.on('notificationsEnabled', ({ notificationDetails }) => {
      updateClientContext({
        details: notificationDetails,
      });
    });

    sdk.on('notificationsDisabled', () => {
      updateClientContext({
        details: undefined,
      });
    });

    async function fetchContext() {
      try {
        // if not running in a mini app, context resolves as undefined
        const context = await sdk.context;
        setContext(context);
      } catch (error) {
        console.error('Error fetching context:', error);
      }
    }

    fetchContext();

    return () => {
      sdk.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateClientContext = useCallback(
    ({ details, frameAdded }: UpdateClientContextParams) => {
      setContext((prevContext) => {
        if (!prevContext) {
          return null;
        }
        return {
          ...prevContext,
          client: {
            ...prevContext.client,
            notificationDetails: details ?? undefined,
            added: frameAdded ?? prevContext.client.added,
          },
        };
      });
    },
    [],
  );

  const connectors = useMemo(() => {
    return [
      context // if context is set, the app is running in a frame, use farcasterFrame connector
        ? farcasterFrame()
        : coinbaseWallet({
            appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            appLogoUrl: process.env.NEXT_PUBLIC_ICON_URL,
            preference: onchainKitProps.config?.wallet?.preference,
          }),
    ];
  }, [context, onchainKitProps.config?.wallet?.preference]);

  const value = useMemo(() => {
    return {
      context,
      updateClientContext,
      notificationProxyUrl,
      __isMiniKit: true,
    };
  }, [updateClientContext, notificationProxyUrl, context]);

  return (
    <MiniKitContext.Provider value={value}>
      <DefaultOnchainKitProviders connectors={connectors}>
        <OnchainKitProvider {...onchainKitProps}>
          <AutoConnect enabled={autoConnect}>
            <div
              style={{
                paddingTop: context?.client.safeAreaInsets?.top ?? 0,
                paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
                paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
                paddingRight: context?.client.safeAreaInsets?.right ?? 0,
              }}
            >
              {children}
            </div>
          </AutoConnect>
        </OnchainKitProvider>
      </DefaultOnchainKitProviders>
    </MiniKitContext.Provider>
  );
}
