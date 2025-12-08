import { useCallback, useEffect, useRef, useState } from 'react';
import { type AccountAssociation } from '../hooks/useSignManifest';
import { Success } from './Success';
import { Connect } from './steps/Connect';
import { Domain } from './steps/Domain';
import { Sign } from './steps/Sign';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;
const WEBSOCKET_URL = 'ws://localhost:3333';

function Page() {
  const wsRef = useRef<WebSocket | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [accountAssocation, setAccountAssocation] =
    useState<AccountAssociation | null>(null);

  const handleSigned = useCallback((accountAssociation: AccountAssociation) => {
    wsRef.current?.send(JSON.stringify(accountAssociation));
    setAccountAssocation(accountAssociation);
  }, []);

  useEffect(() => {
    let reconnectAttempts = 0;

    function connectWebSocket() {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onclose = () => {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          console.log('WebSocket closed, reconnecting...');
          reconnectAttempts++;
          setTimeout(connectWebSocket, RECONNECT_DELAY);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    }

    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const modal = document.querySelector(
            '[data-testid="ockModalOverlay"]',
          );
          if (modal) {
            const signUpButton = modal.querySelector<HTMLElement>(
              'div > div.flex.w-full.flex-col.gap-3 > button:first-of-type',
            );
            const orContinueDiv = modal.querySelector<HTMLElement>(
              'div > div.flex.w-full.flex-col.gap-3 > div.relative',
            );
            if (signUpButton) {
              signUpButton.style.display = 'none';
            }
            if (orContinueDiv) {
              orContinueDiv.style.display = 'none';
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex min-h-screen w-full max-w-[600px] flex-col items-center justify-center gap-6 font-sans">
      <div className="border border-grey-500 p-4">
        <Connect />

        <Domain handleSetDomain={setDomain} />

        <Sign domain={domain} handleSigned={handleSigned} />

        <Success
          accountAssocation={accountAssocation}
          handleClose={window.close}
        />
      </div>
    </main>
  );
}

export default Page;
