import { createConnector } from '@wagmi/core';
import { type Chain } from 'viem';
import { getAddress } from 'viem';
import { createAppClient, viemConnector } from '@farcaster/auth-client';

export interface FarcasterConnectorOptions {
  chains?: Chain[];
  options: {
    appName?: string;
    appIconUrl?: string;
    domain: string;
    siweUri: string;
    relay?: string;
    rpcUrl?: string;
  };
}

export function createFarcasterConnector({ chains = [], options }: FarcasterConnectorOptions) {
  let provider: any;
  let authClient: any;

  const initAuthClient = () => {
    if (!authClient) {
      authClient = createAppClient({
        ethereum: viemConnector(),
        relay: options.relay || 'https://relay.farcaster.xyz',
      });
    }
    return authClient;
  };

  return createConnector((config) => ({
    id: 'farcaster',
    name: 'Farcaster',
    type: 'farcaster',
    
    async connect({ chainId } = {}) {
      try {
        const client = initAuthClient();
        
        // Create a channel for authentication
        const { data: { channelToken } } = await client.createChannel({
          siweUri: options.siweUri,
          domain: options.domain,
        });

        // Wait for user to complete authentication
        const status = await client.watchStatus({ channelToken });
        if (!status.success) {
          throw new Error('Failed to connect to Farcaster');
        }

        // Verify the signature
        const verifyResponse = await client.verifySignInMessage({
          message: status.message,
          signature: status.signature as `0x${string}`,
          domain: options.domain,
        });

        if (!verifyResponse.success) {
          throw new Error('Failed to verify signature');
        }

        const address = getAddress(status.address);
        provider = status.provider;

        const targetChainId = chainId ?? config.chains?.[0]?.id ?? 1;

        return { 
          accounts: [address as `0x${string}`],
          chainId: targetChainId
        };
      } catch (error) {
        throw error;
      }
    },

    async disconnect() {
      provider = undefined;
      authClient = undefined;
    },

    async getAccounts() {
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      return [provider.address as `0x${string}`];
    },

    async getChainId() {
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      return provider.chainId ?? config.chains?.[0]?.id ?? 1;
    },

    async getProvider() {
      return provider;
    },

    async isAuthorized() {
      try {
        if (!provider) return false;
        return !!provider.address;
      } catch {
        return false;
      }
    },

    onAccountsChanged(accounts: string[]) {
    },

    onChainChanged(chainId: string | number) {
    },

    onDisconnect() {
      provider = undefined;
      authClient = undefined;
    },
  }));
}

function normalizeChainId(chainId: string | number): number {
  if (typeof chainId === 'string') {
    return Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10);
  }
  return chainId;
}