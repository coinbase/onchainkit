import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { useGetFid } from '../hooks/useGetFid';
import {
  type AccountAssociation,
  useSignManifest,
} from '../hooks/useSignManifest';
import { validateUrl } from '../utils';
import { Step } from './Step';
import { Success } from './Success';

const MAX_RECONNECT_ATTEMPTS = 5;

function Page() {
  const wsRef = useRef<WebSocket | null>(null);
  const [fid, setFid] = useState<number | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const [accountAssocation, setAccountAssocation] =
    useState<AccountAssociation | null>(null);

  const getFid = useGetFid();
  const { address } = useAccount();
  const { isPending, error, generateAccountAssociation } = useSignManifest({
    domain,
    fid,
    address,
    onSigned: useCallback((accountAssociation) => {
      wsRef.current?.send(JSON.stringify(accountAssociation));
      setAccountAssocation(accountAssociation);
    }, []),
  });

  useEffect(() => {
    let reconnectAttempts = 0;

    function connect() {
      wsRef.current = new WebSocket('ws://localhost:3333');

      wsRef.current.onclose = () => {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          console.log('WebSocket closed, reconnecting...');
          reconnectAttempts++;
          setTimeout(connect, 1000);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    }

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (address) {
      getFid(address).then(setFid);
    }
  }, [address, getFid]);

  useEffect(() => {
    // super hacky way to remove the sign up button and 'or continue' div from the wallet modal
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: cause above
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

  const handleValidateUrl = () => {
    const isValid = validateUrl(domain);
    if (!isValid) {
      setDomainError('Invalid URL');
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    setDomainError(null);
  };

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  return (
    <main className="flex min-h-screen w-full max-w-[600px] flex-col items-center justify-center gap-6 font-sans">
      <div className="border border-grey-500 p-4">
        <Step
          number={1}
          label="Connect your wallet"
          description="Set up a wallet using your warpcast recovery key.  This is available in warp cast under settings/account."
        >
          <Wallet>
            <ConnectWallet className="w-full">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </Step>

        <Step
          number={2}
          label="Enter the domain of your app"
          disabled={!address}
          description="This will be used to generate the account manifest and also added to your .env file as the `NEXT_PUBLIC_URL` variable"
        >
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter the domain"
              className="rounded border border-gray-300 px-4 py-2"
              value={domain}
              onChange={handleDomainChange}
              onBlur={handleValidateUrl}
            />
            {domainError && <p className="text-red-500">{domainError}</p>}
          </div>
        </Step>

        <Step
          number={3}
          label="Sign to generate and save your account manifeset"
          disabled={!address || !domain || fid === 0}
          description="The account manifest will be saved to your .env file as `FARCASTER_HEADER`, `FARCASTER_PAYLOAD` and `FARCASTER_SIGNATURE` variables"
        >
          <div className="flex flex-col gap-2">
            {fid === 0 ? (
              <p className="text-red-500">
                There is no FID associated with this account, please connect
                with your TBA passkey account.
              </p>
            ) : (
              <p>Your FID is {fid}</p>
            )}

            <button
              type="button"
              disabled={!address || !domain || fid === 0}
              onClick={generateAccountAssociation}
              className={`w-fit rounded px-6 py-2 text-white ${
                !address || !domain || fid === 0
                  ? 'bg-blue-200!'
                  : 'bg-blue-800! hover:bg-blue-600!'
              }`}
            >
              {isPending ? 'Signing...' : 'Sign'}
            </button>
            {error && (
              <p className="text-red-500">
                {error.message.split('\n').map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            )}
          </div>
        </Step>
        <Success
          accountAssocation={accountAssocation}
          handleClose={handleClose}
        />
      </div>
    </main>
  );
}

export default Page;
