import { AuthKitProvider, SignInButton, type AuthClientError } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import { useConnect } from 'wagmi';
import { useCallback } from 'react';
import { createFarcasterConnector } from '../wallet/connectors/farcaster';

const config = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: 'https://mainnet.optimism.io',
  domain: typeof window !== 'undefined' ? window.location.host : '',
  siweUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
};

export function FarcasterLogin() {
  const { connect } = useConnect();

  const handleSuccess = useCallback((response: any) => {
    console.log('Login successful:', response);
    
    try {
      // Create and connect to the Farcaster connector
      const farcasterConnector = createFarcasterConnector({
        options: {
          domain: config.domain,
          siweUri: config.siweUri,
          relay: config.relay,
          rpcUrl: config.rpcUrl,
        }
      });
      
      // Connect with wagmi
      connect({ connector: farcasterConnector });
    } catch (error) {
      console.error('Farcaster connector error:', error);
    }
  }, [connect]);

  const handleError = (error?: AuthClientError) => {
    console.error('Login failed:', error);
  };

  return (
    <AuthKitProvider config={config}>
      <div style={{ padding: '20px' }}>
        <SignInButton
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </AuthKitProvider>
  );
} 