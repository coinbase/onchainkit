import {
  AuthKitProvider,
  SignInButton,
  useProfile,
} from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import { useEffect, useState } from 'react';

// Storage key for Farcaster auth data
const FARCASTER_AUTH_STORAGE_KEY = 'farcaster-auth-session';

// Configuration for Farcaster Auth
const config = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: 'https://mainnet.optimism.io',
  domain: typeof window !== 'undefined' ? window.location.host : '',
  siweUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
  // Enable session persistence
  persist: true, // This enables the built-in persistence in auth-kit
};

export function FarcasterLogin() {
  return (
    <AuthKitProvider config={config}>
      <div>
        <SignInButton />
      </div>
      <Profile />
    </AuthKitProvider>
  );
}

function Profile() {
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName },
  } = profile;

  // Track previous authentication state to detect changes
  const [prevAuthState, setPrevAuthState] = useState(false);

  // Save authentication state to localStorage when it changes
  useEffect(() => {
    // Only proceed if authentication state has changed
    if (prevAuthState !== isAuthenticated) {
      setPrevAuthState(isAuthenticated);

      if (isAuthenticated && fid) {
        // Store the authentication state in localStorage
        localStorage.setItem(
          FARCASTER_AUTH_STORAGE_KEY,
          JSON.stringify({
            isAuthenticated,
            profile: { fid, displayName },
            timestamp: Date.now(),
          })
        );

        // Dispatch a custom event to notify other components
        const authEvent = new CustomEvent('farcaster-auth-changed', {
          detail: { isAuthenticated: true, fid, displayName }
        });
        window.dispatchEvent(authEvent);
      } else if (!isAuthenticated && prevAuthState) {
        // User has signed out
        localStorage.removeItem(FARCASTER_AUTH_STORAGE_KEY);
        
        // Dispatch a custom event to notify other components
        const authEvent = new CustomEvent('farcaster-auth-changed', {
          detail: { isAuthenticated: false }
        });
        window.dispatchEvent(authEvent);
      }
    }
  }, [isAuthenticated, fid, displayName, prevAuthState]);

  return (
    <div style={{ textAlign: 'center' }}>
      {isAuthenticated ? (
        <div>
          <p>
            Hello, {displayName}!
          </p>
          <p>Your FID is {fid}.</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
} 