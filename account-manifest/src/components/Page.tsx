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
    wsRef.current = new WebSocket('ws://localhost:3333');

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

  return (
    <main className="flex min-h-screen w-[600px] flex-col gap-6 font-sans">
      <Step
        label="1"
        description={
          <>
            <p className="p-4">
              Use coinbase smart wallet if you have a passkey farcaster account
              through TBA
            </p>
            <p className="p-4">
              Use MetaMask or Phantom to set up a wallet using your warpcast
              recovery key
            </p>
          </>
        }
      >
        <Wallet className="w-[206px]">
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
        label="2"
        disabled={!address}
        description={
          <>
            <p className="p-4">Enter the domain your app will be hosted on</p>
            <p className="p-4">
              This will be used to generate the account manifest and also added
              to your .env file as the `NEXT_PUBLIC_URL` variable
            </p>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter Domain"
            className="rounded border border-gray-300 px-4 py-2"
            value={domain}
            onChange={handleDomainChange}
            onBlur={handleValidateUrl}
          />
          {domainError && <p className="text-red-500">{domainError}</p>}
        </div>
      </Step>

      <Step
        label="3"
        disabled={!address || !domain || fid === 0}
        description={
          <>
            <p className="p-4">
              This will generate the account manifest and sign it with your
              wallet
            </p>
            <p className="p-4">
              The account manifest will be saved to your .env file as
              `FARCASTER_HEADER`, `FARCASTER_PAYLOAD` and `FARCASTER_SIGNATURE`
              variables
            </p>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          {fid === 0 ? (
            <p className="text-red-500">
              There is no FID associated with this account, please connect with
              your TBA passkey account.
            </p>
          ) : (
            <p>Your FID is {fid}</p>
          )}

          <button
            type="button"
            disabled={!address || !domain || fid === 0}
            onClick={generateAccountAssociation}
            className={`rounded px-4 py-2 text-white ${
              !address || !domain || fid === 0
                ? 'bg-blue-200!'
                : 'bg-blue-800! hover:bg-blue-600!'
            }`}
          >
            {isPending ? 'Signing...' : 'Sign Account Manifest'}
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
      <Success accountAssocation={accountAssocation} />
    </main>
  );
}

export default Page;
