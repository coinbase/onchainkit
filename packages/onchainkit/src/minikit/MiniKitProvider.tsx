'use client';
import sdk, { type Context } from '@farcaster/miniapp-sdk';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  MiniKitContextType,
  MiniKitProviderProps,
  UpdateClientContextParams,
} from './types';
import { AutoConnect } from './components/AutoConnect';

export const MiniKitContext = createContext<MiniKitContextType>({
  enabled: false,
  context: null,
  updateClientContext: () => {},
  notificationProxyUrl: '',
  __isMiniKit: false,
});

function MiniKitProviderContent({
  children,
  notificationProxyUrl = '/api/notify',
  autoConnect = true,
}: MiniKitProviderProps) {
  const [context, setContext] = useState<Context.MiniAppContext | null>(null);

  const updateClientContext = useCallback(
    ({ details, miniAppAdded }: UpdateClientContextParams) => {
      setContext((prevContext) => {
        if (!prevContext) {
          return null;
        }
        return {
          ...prevContext,
          client: {
            ...prevContext.client,
            notificationDetails: details ?? undefined,
            added: miniAppAdded ?? prevContext.client.added,
          },
        };
      });
    },
    [],
  );

  useEffect(() => {
    sdk.on('miniAppAdded', ({ notificationDetails }) => {
      if (notificationDetails) {
        updateClientContext({
          details: notificationDetails,
          miniAppAdded: true,
        });
      }
    });

    sdk.on('miniAppAddRejected', ({ reason }) => {
      console.error('MiniApp add rejected', reason);
    });

    sdk.on('miniAppRemoved', () => {
      updateClientContext({
        details: undefined,
        miniAppAdded: false,
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
        // if not running in a frame, context resolves as undefined
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
  }, [updateClientContext]);

  const value = useMemo(() => {
    return {
      enabled: true,
      context,
      updateClientContext,
      notificationProxyUrl,
      __isMiniKit: true,
    };
  }, [updateClientContext, notificationProxyUrl, context]);

  return (
    <MiniKitContext.Provider value={value}>
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
    </MiniKitContext.Provider>
  );
}

export function MiniKitProvider({
  children,
  notificationProxyUrl,
  enabled,
  autoConnect,
}: MiniKitProviderProps) {
  if (!enabled) {
    return children;
  }

  return (
    <MiniKitProviderContent
      notificationProxyUrl={notificationProxyUrl}
      autoConnect={autoConnect}
    >
      {children}
    </MiniKitProviderContent>
  );
}
