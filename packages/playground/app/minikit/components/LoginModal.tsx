import { useState, useEffect, useRef, useCallback } from 'react';
import { FarcasterLogin } from '../../../../onchainkit/src/components/FarcasterLogin';
import { ConnectWallet, ConnectWalletText } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

// --- Start of Shared Farcaster Auth Logic ---
export const FARCASTER_AUTH_SESSION_KEY = 'farcaster-auth-session';

export interface FarcasterUser {
  fid?: number;
  displayName?: string;
}

export function useFarcasterAuth() {
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser>({});

  const checkFarcasterSession = useCallback(() => {
    const sessionData = localStorage.getItem(FARCASTER_AUTH_SESSION_KEY);
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        const isSessionValid = parsedData.timestamp &&
          (Date.now() - parsedData.timestamp) < 24 * 60 * 60 * 1000;

        if (isSessionValid && parsedData.isAuthenticated) {
          setIsFarcasterConnected(true);
          setFarcasterUser({
            fid: parsedData.profile?.fid,
            displayName: parsedData.profile?.displayName,
          });
        } else {
          localStorage.removeItem(FARCASTER_AUTH_SESSION_KEY);
          setIsFarcasterConnected(false);
          setFarcasterUser({});
        }
      } catch (e) {
        console.error('Failed to parse Farcaster session data', e);
        localStorage.removeItem(FARCASTER_AUTH_SESSION_KEY);
        setIsFarcasterConnected(false);
        setFarcasterUser({});
      }
    } else {
      setIsFarcasterConnected(false);
      setFarcasterUser({});
    }
  }, []);

  useEffect(() => {
    checkFarcasterSession();

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === FARCASTER_AUTH_SESSION_KEY) {
        checkFarcasterSession();
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    const handleFarcasterAuthChangedEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isAuthenticated === 'boolean') {
        if (customEvent.detail.isAuthenticated) {
          setIsFarcasterConnected(true);
          setFarcasterUser({
            fid: customEvent.detail.fid,
            displayName: customEvent.detail.displayName,
          });
        } else {
          setIsFarcasterConnected(false);
          setFarcasterUser({});
        }
      } else {
        checkFarcasterSession();
      }
    };
    window.addEventListener('farcaster-auth-changed', handleFarcasterAuthChangedEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('farcaster-auth-changed', handleFarcasterAuthChangedEvent);
    };
  }, [checkFarcasterSession]);

  const signOutFarcaster = useCallback(() => {
    localStorage.removeItem(FARCASTER_AUTH_SESSION_KEY);
    setIsFarcasterConnected(false);
    setFarcasterUser({});
    const authEvent = new CustomEvent('farcaster-auth-changed', {
      detail: { isAuthenticated: false }
    });
    window.dispatchEvent(authEvent);
  }, []);

  return { isFarcasterConnected, farcasterUser, signOutFarcaster };
}
// --- End of Shared Farcaster Auth Logic ---

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isConnected } = useAccount();
  const { 
    isFarcasterConnected, 
    farcasterUser, 
    signOutFarcaster: hookSignOutFarcaster 
  } = useFarcasterAuth();
  const initialFarcasterConnectedRef = useRef<boolean | null>(null);
  const initialWalletConnectedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      initialFarcasterConnectedRef.current = isFarcasterConnected;
      initialWalletConnectedRef.current = isConnected;
    }
  }, [isOpen, isFarcasterConnected, isConnected]);

  useEffect(() => {
    const isNewFarcasterConnection = initialFarcasterConnectedRef.current === false && isFarcasterConnected === true;
    const isNewWalletConnection = initialWalletConnectedRef.current === false && isConnected === true;
    
    if ((isNewFarcasterConnection || isNewWalletConnection) && isOpen) {
      onClose();
    }
  }, [isConnected, isFarcasterConnected, isOpen, onClose]);

  // Handle Farcaster sign out
  const handleFarcasterSignOut = () => {
    hookSignOutFarcaster();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-center font-regular mb-4">Choose Login Method</h2>
        <div className="flex flex-col gap-4 justify-center items-center">
          <p className="text-center text-sm text-gray-500">
            Login with your Coinbase Wallet to continue
          </p>
          <ConnectWallet 
            className="w-full bg-[#0052FF] text-white py-4 px-4 rounded-lg hover:bg-[#0040CC] transition-colors"
          >
            <ConnectWalletText>Coinbase Wallet</ConnectWalletText>
          </ConnectWallet>
          <div className="border-t border-gray-200 my-2" />
          {!isFarcasterConnected ? (
            <p className="text-center text-sm text-gray-500">
              Or login with Farcaster
            </p>
          ):<></>}
          {isFarcasterConnected ? (
            <div className="w-full text-center">
              <p className="mb-2">
                Logged in as <strong>{farcasterUser.displayName}</strong>
              </p>
              <p>
                FID: {farcasterUser.fid}
              </p>
              <button 
                onClick={handleFarcasterSignOut}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Sign out of Farcaster
              </button>
            </div>
          ) : (
            <FarcasterLogin />
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
} 