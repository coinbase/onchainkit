import { createConnector } from '@wagmi/core';
import { type Chain } from 'viem';
import { getAddress } from 'viem';
import { createAppClient, viemConnector } from '@farcaster/auth-client';

// Storage key for Farcaster auth data within Wagmi storage
const FARCASTER_STORAGE_KEY = 'farcaster-connector-data';

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
        // Check if we have stored connection data
        const storedData = await config.storage?.getItem(FARCASTER_STORAGE_KEY);
        
        if (storedData && storedData.address) {
          // We have stored data, try to resume the connection
          provider = storedData.provider;
          
          // Return the connection data
          return {
            accounts: [storedData.address as `0x${string}`],
            chainId: storedData.chainId || config.chains?.[0]?.id || 1
          };
        }
        
        // If we don't have stored data, proceed with a new connection
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
        
        // Save the connection data to storage
        await config.storage?.setItem(FARCASTER_STORAGE_KEY, {
          address,
          chainId: targetChainId,
          provider: status.provider,
          fid: status.fid,
          username: status.username,
        });

        return { 
          accounts: [address as `0x${string}`],
          chainId: targetChainId
        };
      } catch (error) {
        throw error;
      }
    },

    async disconnect() {
      // Clear stored data on disconnect
      await config.storage?.removeItem(FARCASTER_STORAGE_KEY);
      provider = undefined;
      authClient = undefined;
    },

    async getAccounts() {
      const storedData = await config.storage?.getItem(FARCASTER_STORAGE_KEY);
      if (storedData && storedData.address) {
        return [storedData.address as `0x${string}`];
      }
      
      if (!provider || !provider.address) {
        throw new Error('Provider not initialized');
      }
      return [provider.address as `0x${string}`];
    },

    async getChainId() {
      const storedData = await config.storage?.getItem(FARCASTER_STORAGE_KEY);
      if (storedData && storedData.chainId) {
        return storedData.chainId;
      }
      
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      return provider.chainId ?? config.chains?.[0]?.id ?? 1;
    },

    async getProvider() {
      const storedData = await config.storage?.getItem(FARCASTER_STORAGE_KEY);
      if (storedData && storedData.provider) {
        return storedData.provider;
      }
      return provider;
    },

    async isAuthorized() {
      try {
        // Check if we have stored connection data
        const storedData = await config.storage?.getItem(FARCASTER_STORAGE_KEY);
        
        if (storedData && storedData.address) {
          // We have stored data, the user is authorized
          return true;
        }
        
        if (!provider) return false;
        return !!provider.address;
      } catch {
        return false;
      }
    },

    onAccountsChanged(accounts) {
      // Handle accounts change if needed
    },

    onChainChanged(chainId) {
      // Handle chain change if needed
    },

    onDisconnect() {
      // Clear stored data on disconnect
      config.storage?.removeItem(FARCASTER_STORAGE_KEY);
      provider = undefined;
      authClient = undefined;
    }
  }));
}

function normalizeChainId(chainId: string | number): number {
  if (typeof chainId === 'string') {
    return Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10);
  }
  return chainId;
}