import { AuthKitProvider, SignInButton, type AuthClientError } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

const config = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: 'https://mainnet.optimism.io',
  domain: typeof window !== 'undefined' ? window.location.host : '',
  siweUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
};

export function FarcasterLogin() {
  const handleSuccess = (response: any) => {
    console.log('Login successful:', response);
  };

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