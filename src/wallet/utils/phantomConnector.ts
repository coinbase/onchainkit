import { type Connector, createConnector } from '@wagmi/core';
import { ConnectorNotFoundError } from '@wagmi/core';
import {
  ResourceNotFoundRpcError,
  type RpcError,
  UserRejectedRequestError,
  getAddress,
} from 'viem';

export type PhantomConnector = ReturnType<typeof phantomConnector>;

// Add this type at the top of the file, after the imports
interface WindowProvider {
  isPhantom?: boolean;
  providers?: WindowProvider[];
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

// Extend the global Window interface to include Phantom's specific provider
type PhantomWindow = {
  phantom?: {
    ethereum?: WindowProvider;
  };
};

declare global {
  interface Window extends PhantomWindow {}
}

// helper function before the phantomConnector function
function isUserRejectedRequestError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string' &&
    ((error as { message: string }).message.includes('user rejected') ||
      (error as { message: string }).message.includes('User rejected'))
  );
}

export type PhantomParameters = {
  shimDisconnect?: boolean;
};

export const phantomConnector = Object.assign(
  ({ shimDisconnect = true }: PhantomParameters = {}) => {
    let provider: WindowProvider | undefined;
    let accountsChanged: Connector['onAccountsChanged'] | undefined;
    let chainChanged: Connector['onChainChanged'] | undefined;
    let disconnect: Connector['onDisconnect'] | undefined;

    return createConnector<WindowProvider, Record<string, unknown>>(
      (config) => {
        // Create a connector instance to bind 'this' context
        const connector = {
          id: 'phantom',
          name: 'Phantom',
          type: phantomConnector.type,

          // Convert regular methods to arrow functions to preserve 'this' context
          setup: async () => {
            const provider = await connector.getProvider();
            if (!provider?.on) return;

            if (!accountsChanged) {
              accountsChanged = connector.onAccountsChanged.bind(connector);
              provider.on('accountsChanged', accountsChanged);
            }
          },

          connect: async ({ chainId }: { chainId?: number } = {}) => {
            const provider = await connector.getProvider();
            if (!provider) throw new ConnectorNotFoundError();

            try {
              const accounts = await provider
                .request({
                  method: 'eth_requestAccounts',
                })
                .then((accounts) => accounts.map(getAddress));

              let currentChainId = await connector.getChainId();
              if (chainId && currentChainId !== chainId) {
                const chain = await connector.switchChain!({ chainId }).catch(
                  (error) => {
                    if (error.code === UserRejectedRequestError.code)
                      throw error;
                    return { id: currentChainId };
                  },
                );
                currentChainId = chain?.id ?? currentChainId;
              }

              // Setup event listeners after successful connection
              if (!chainChanged && provider.on) {
                chainChanged = connector.onChainChanged.bind(connector);
                provider.on('chainChanged', chainChanged);
              }
              if (!disconnect && provider.on) {
                disconnect = connector.onDisconnect.bind(connector);
                provider.on('disconnect', disconnect);
              }

              if (shimDisconnect)
                config.storage?.setItem(
                  `${connector.id}.disconnected`,
                  'false',
                );

              return { accounts, chainId: currentChainId };
            } catch (err) {
              const error = err as RpcError;
              if (isUserRejectedRequestError(error))
                throw new UserRejectedRequestError(error);
              if ((error as { code: number }).code === -32002)
                throw new ResourceNotFoundRpcError(error);
              throw error;
            }
          },

          // Convert other methods to arrow functions
          getProvider: async () => {
            if (provider) return provider;

            function getReady(ethereum?: WindowProvider) {
              const isPhantom = !!ethereum?.isPhantom;
              if (!isPhantom) return;
              return ethereum;
            }

            if (typeof window === 'undefined')
              throw new ConnectorNotFoundError();
            const ethereum = window?.phantom?.ethereum;
            provider = ethereum?.providers
              ? ethereum.providers.find(getReady)
              : getReady(ethereum);

            if (!provider) throw new ConnectorNotFoundError();
            return provider;
          },

          disconnect: async () => {
            const provider = await connector.getProvider();

            // Remove all event listeners
            if (provider?.removeListener) {
              if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
              }
              if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
              }
              if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
              }
            }

            if (shimDisconnect)
              config.storage?.setItem(`${connector.id}.disconnected`, 'true');
          },

          getAccounts: async () => {
            const provider = await connector.getProvider();
            if (!provider) return [];
            return (provider as WindowProvider)
              .request({ method: 'eth_accounts' })
              .then((accounts: string[]) => accounts.map(getAddress));
          },

          getChainId: async () => {
            const provider = await connector.getProvider();
            if (!provider) throw new ConnectorNotFoundError();
            return (provider as WindowProvider)
              .request({ method: 'eth_chainId' })
              .then((chainId: string) => Number(chainId));
          },

          isAuthorized: async () => {
            try {
              const accounts = await connector.getAccounts();
              return accounts.length > 0;
            } catch {
              return false;
            }
          },

          switchChain: async ({ chainId }: { chainId: number }) => {
            const provider = await connector.getProvider();
            if (!provider) throw new ConnectorNotFoundError();
            return (provider as WindowProvider).request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
          },

          onAccountsChanged: (accounts: string[]) => {
            if (accounts.length === 0) {
              connector.onDisconnect();
            } else {
              config.emitter.emit('change', {
                accounts: accounts.map((x) => getAddress(x)),
              });
            }
          },

          onChainChanged: (chainId: string) => {
            const id = Number(chainId);
            config.emitter.emit('change', { chainId: id });
          },

          onDisconnect: () => {
            config.emitter.emit('disconnect');

            const cleanup = async () => {
              const provider = await connector.getProvider();
              if (!provider?.removeListener) return;

              if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
              }
              if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
              }
            };
            cleanup();
          },
        };

        return connector;
      },
    );
  },
  { type: 'phantom' as const },
);
