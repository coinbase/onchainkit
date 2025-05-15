'use client';

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from '@coinbase/onchainkit/minikit';
import { Name, Identity, Badge } from '@coinbase/onchainkit/identity';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Snake, { SCHEMA_UID } from './components/snake';
import { useAccount } from 'wagmi';
import Check from './svg/Check';

const FARCASTER_AUTH_SESSION_KEY = 'farcaster-auth-session';

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<{ fid?: number, displayName?: string }>({});

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const { address } = useAccount();

  useEffect(() => {
    const checkFarcasterSession = () => {
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
              displayName: parsedData.profile?.displayName
            });
          } else {
            setIsFarcasterConnected(false);
            setFarcasterUser({});
          }
        } catch (e) {
          setIsFarcasterConnected(false);
          setFarcasterUser({});
        }
      } else {
        setIsFarcasterConnected(false);
        setFarcasterUser({});
      }
    };

    checkFarcasterSession();
    
    const handleFarcasterAuth = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.isAuthenticated) {
          setIsFarcasterConnected(true);
          setFarcasterUser({
            fid: customEvent.detail.fid,
            displayName: customEvent.detail.displayName
          });
        } else {
          setIsFarcasterConnected(false);
          setFarcasterUser({});
        }
      } else {
        checkFarcasterSession();
      }
    };
    
    window.addEventListener('storage', (e) => {
      if (e.key === FARCASTER_AUTH_SESSION_KEY) {
        handleFarcasterAuth(e);
      }
    });
    window.addEventListener('farcaster-auth-changed', handleFarcasterAuth);
    
    return () => {
      window.removeEventListener('farcaster-auth-changed', handleFarcasterAuth);
    };
  }, []);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          type="button"
          onClick={handleAddFrame}
          className="cursor-pointer bg-transparent font-semibold text-sm"
        >
          + SAVE MINI-APP
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex animate-fade-out items-center space-x-1 font-semibold text-sm">
          <Check />
          <span>SAVED</span>
        </div>
      );
    }

    return null;
  }, [context, handleAddFrame, frameAdded]);

  return (
    <div className="snake-dark relative flex min-h-screen flex-col items-center bg-[#E5E5E5] font-sans text-black sm:min-h-[820px]">
      <div className="w-screen max-w-[520px]">
        <header className="mt-1 mr-2 flex justify-between">
          <div className="justify-start pl-1">
            {address ? (
              <Identity
                address={address}
                schemaId={SCHEMA_UID}
                className="!bg-inherit p-0 [&>div]:space-x-2"
              >
                <Name className="text-inherit">
                  <Badge
                    tooltip="High Scorer"
                    className="!bg-inherit high-score-badge"
                  />
                </Name>
              </Identity>
            ) : isFarcasterConnected ? (
              <div className="pt-1 pl-2 font-semibold text-sm">
                {farcasterUser.displayName} (Farcaster)
              </div>
            ) : (
              <div className="pt-1 pl-2 font-semibold text-gray-500 text-sm">
                NOT CONNECTED
              </div>
            )}
          </div>
          <div className="justify-end pr-1">{saveFrameButton}</div>
        </header>

        <main className="font-serif">
          <Snake />
        </main>

        <footer className="absolute bottom-4 flex w-screen max-w-[520px] items-center justify-center">
          <button
            type="button"
            className="mt-4 ml-4 flex justify-start rounded-2xl border border-black px-2 py-1 font-semibold text-xs opacity-40"
            onClick={() => openUrl('https://base.org/builders/minikit')}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  );
}
