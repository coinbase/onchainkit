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
import { Step } from '../Step';
import { useEffect } from 'react';

export function Connect() {
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
    <Step
      number={1}
      label="Connect your wallet"
      description="Set up a wallet using your Warpcast recovery key.  This is available in the Warpcast mobile app under Settings > Advanced > Farcaster recovery phrase."
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
  );
}
